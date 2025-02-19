import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const PsychometricAssessment = () => {
  const [questionBank, setQuestionBank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [showReport, setShowReport] = useState(false);

  const likertOptions = [
    { value: 1, label: 'Strongly Disagree' },
    { value: 2, label: 'Disagree' },
    { value: 3, label: 'Neutral' },
    { value: 4, label: 'Agree' },
    { value: 5, label: 'Strongly Agree' },
  ];

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true);
        const response = await fetch('/data/questionBank.json');
        if (!response.ok) {
          throw new Error('Failed to load questions');
        }
        const data = await response.json();
        
        // Validate question bank structure
        if (!validateQuestionBank(data)) {
          throw new Error('Invalid question bank structure');
        }
        
        setQuestionBank(data);
        const randomized = selectRandomQuestions(data);
        setSelectedQuestions(randomized);
      } catch (err) {
        setError(err.message);
        toast.error('Failed to load questions. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, []);

  const validateQuestionBank = (data) => {
    const requiredCategories = ['Judgment', 'Achievement', 'Relationship', 'Learning Agility'];
    return (
      data &&
      typeof data === 'object' &&
      requiredCategories.every(category => 
        Array.isArray(data[category]) &&
        data[category].length >= 10 &&
        data[category].every(q => 
          q.id && 
          typeof q.id === 'string' &&
          q.text &&
          typeof q.text === 'string' &&
          q.category === category
        )
      )
    );
  };

  const selectRandomQuestions = (data) => {
    const selected = [];
    Object.entries(data).forEach(([category, questions]) => {
      const shuffled = [...questions].sort(() => 0.5 - Math.random());
      selected.push(...shuffled.slice(0, 10));
    });
    return selected.sort(() => 0.5 - Math.random());
  };

  const handleResponse = (value) => {
    const currentQuestion = selectedQuestions[currentQuestionIndex];
    setResponses(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));

    if (currentQuestionIndex < selectedQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      toast.success('Response recorded');
    } else {
      setShowReport(true);
      toast.success('Assessment completed!');
    }
  };

  const calculateCategoryScore = (category) => {
    const categoryQuestions = selectedQuestions.filter(q => q.category === category);
    const scores = categoryQuestions.map(q => responses[q.id] || 0);
    return scores.reduce((a, b) => a + b, 0) / categoryQuestions.length;
  };

  if (loading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="flex items-center justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading assessment...</span>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="py-10">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button 
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (showReport) {
    const categories = ['Judgment', 'Achievement', 'Relationship', 'Learning Agility'];
    const scores = categories.map(category => ({
      category,
      score: calculateCategoryScore(category)
    }));

    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Your JARL Assessment Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {scores.map(({ category, score }) => (
              <div key={category} className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">{category}</span>
                  <span>{score.toFixed(1)}/5.0</span>
                </div>
                <Progress value={score * 20} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentQuestion = selectedQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / 40) * 100;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>JARL Psychometric Assessment</CardTitle>
        <Progress value={progress} className="h-2" />
        <div className="text-sm text-gray-500 mt-2">
          Question {currentQuestionIndex + 1} of 40
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <p className="text-lg">{currentQuestion.text}</p>
          <div className="grid grid-cols-1 gap-3">
            {likertOptions.map((option) => (
              <Button
                key={option.value}
                variant="outline"
                className="w-full justify-start text-left"
                onClick={() => handleResponse(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PsychometricAssessment;
