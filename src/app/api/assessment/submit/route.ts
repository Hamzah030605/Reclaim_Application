import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { responses, name, age } = await request.json()

    // Get the authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'No authorization header' },
        { status: 401 }
      )
    }

    // Create a Supabase client with the user's session
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      }
    )

    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Calculate total score and severity level
    const totalScore = responses.reduce((sum: number, response: any) => {
      return sum + (response.response_value || 0)
    }, 0)

    // Determine severity level based on score
    let severityLevel = 'low'
    if (totalScore >= 60) severityLevel = 'severe'
    else if (totalScore >= 45) severityLevel = 'high'
    else if (totalScore >= 30) severityLevel = 'moderate'
    else severityLevel = 'low'

    // Create analysis data
    const analysisData = {
      totalScore,
      severityLevel,
      categoryScores: {
        frequency: responses.filter((r: any) => r.category === 'frequency').reduce((sum: number, r: any) => sum + (r.response_value || 0), 0),
        impact: responses.filter((r: any) => r.category === 'impact').reduce((sum: number, r: any) => sum + (r.response_value || 0), 0),
        control: responses.filter((r: any) => r.category === 'control').reduce((sum: number, r: any) => sum + (r.response_value || 0), 0),
        motivation: responses.filter((r: any) => r.category === 'motivation').reduce((sum: number, r: any) => sum + (r.response_value || 0), 0)
      },
      averageScores: {
        frequency: 2.5, // Average for non-porn users
        impact: 1.8,
        control: 2.2,
        motivation: 4.5
      },
      recommendations: generateRecommendations(severityLevel, totalScore)
    }

    // Create assessment record
    const { data: assessment, error: assessmentError } = await supabase
      .from('user_assessments')
      .insert({
        user_id: user.id,
        name,
        age,
        total_score: totalScore,
        severity_level: severityLevel,
        analysis_data: analysisData
      })
      .select()
      .single()

    if (assessmentError) {
      console.error('Error creating assessment:', assessmentError)
      return NextResponse.json(
        { error: 'Failed to save assessment' },
        { status: 500 }
      )
    }

    // Save individual responses
    const responseData = responses.map((response: any) => ({
      assessment_id: assessment.id,
      question_id: response.question_id,
      question_text: response.question_text,
      response_value: response.response_value,
      response_text: response.response_text,
      category: response.category
    }))

    const { error: responsesError } = await supabase
      .from('assessment_responses')
      .insert(responseData)

    if (responsesError) {
      console.error('Error saving responses:', responsesError)
      // Don't fail the request, just log the error
    }

    return NextResponse.json({
      success: true,
      data: {
        assessmentId: assessment.id,
        totalScore,
        severityLevel,
        analysis: analysisData
      }
    })

  } catch (error) {
    console.error('Error in assessment submit API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function generateRecommendations(severityLevel: string, totalScore: number) {
  const recommendations = {
    low: [
      'Maintain healthy habits and boundaries',
      'Consider setting up accountability measures',
      'Focus on building positive relationships'
    ],
    moderate: [
      'Implement structured recovery plan',
      'Seek support from community',
      'Practice mindfulness and stress management',
      'Set clear boundaries and limits'
    ],
    high: [
      'Consider professional counseling',
      'Join intensive recovery program',
      'Implement strict accountability measures',
      'Focus on underlying emotional issues',
      'Build strong support network'
    ],
    severe: [
      'Seek professional therapy immediately',
      'Consider inpatient treatment program',
      'Implement comprehensive recovery plan',
      'Address underlying mental health issues',
      'Build extensive support network',
      'Consider medication-assisted treatment'
    ]
  }

  return recommendations[severityLevel as keyof typeof recommendations] || recommendations.moderate
}
