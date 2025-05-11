import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, ArrowRight, RefreshCcw } from 'lucide-react';
import { geminiService } from '@/services/GeminiService';
import { useToast } from "@/hooks/use-toast";

interface QuizViewProps {
  codebaseData: any;
  role: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export const QuizView: React.FC<QuizViewProps> = ({ codebaseData, role }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);

  useEffect(() => {
    const generateQuestions = async () => {
      try {
        const generatedQuestions = await geminiService.generateQuizQuestions(codebaseData);
        if (generatedQuestions.length > 0) {
          setQuestions(generatedQuestions);
        } else {
          // Fallback questions if generation fails
          setQuestions([
            {
              question: `What is the main architectural pattern used in this codebase?`,
              options: codebaseData.architecture?.patterns || [],
              correctAnswer: 0,
              explanation: codebaseData.architecture?.overview || 'This pattern helps organize the codebase efficiently.'
            },
            {
              question: "Which component is responsible for state management?",
              options: ["Context API", "Redux", "Local State", "MobX"],
              correctAnswer: 0,
              explanation: "The application uses React Context API for state management across components."
            }
          ]);
        }
      } catch (error) {
        console.error("Error generating quiz questions:", error);
        toast({
          title: "Error generating questions",
          description: "Using fallback questions instead",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    generateQuestions();
  }, [codebaseData]);

  const handleAnswer = () => {
    if (selectedAnswer === null) return;
    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizComplete(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setQuizComplete(false);
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Loading Quiz Questions...</CardTitle>
          <CardDescription>Please wait while we analyze the codebase</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-8 bg-muted animate-pulse rounded"></div>
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-6 bg-muted animate-pulse rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Codebase Knowledge Quiz</CardTitle>
            <CardDescription>Test your understanding of the repository</CardDescription>
          </div>
          <Badge variant="secondary">
            {currentQuestion + 1} of {questions.length}
          </Badge>
        </div>
        <Progress value={(currentQuestion / questions.length) * 100} className="mt-2" />
      </CardHeader>

      <CardContent>
        {!quizComplete ? (
          <div className="space-y-6">
            <div className="text-lg font-medium">
              {questions[currentQuestion].question}
            </div>

            <RadioGroup
              value={selectedAnswer?.toString()}
              onValueChange={(value) => setSelectedAnswer(parseInt(value))}
              className="space-y-3"
            >
              {questions[currentQuestion].options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value={index.toString()} 
                    id={`option-${index}`}
                    disabled={showExplanation}
                  />
                  <Label htmlFor={`option-${index}`}>{option}</Label>
                  {showExplanation && index === questions[currentQuestion].correctAnswer && (
                    <CheckCircle className="h-5 w-5 text-green-500 ml-2" />
                  )}
                  {showExplanation && selectedAnswer === index && index !== questions[currentQuestion].correctAnswer && (
                    <XCircle className="h-5 w-5 text-red-500 ml-2" />
                  )}
                </div>
              ))}
            </RadioGroup>

            {showExplanation && (
              <div className="bg-muted p-4 rounded-md">
                <p className="font-medium mb-2">Explanation:</p>
                <p className="text-muted-foreground">
                  {questions[currentQuestion].explanation}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-2xl font-bold mb-4">
              Quiz Complete!
            </div>
            <div className="text-lg mb-6">
              Your score: {score} out of {questions.length}
              <div className="text-muted-foreground mt-2">
                ({Math.round((score / questions.length) * 100)}%)
              </div>
            </div>
            <Button onClick={restartQuiz} variant="outline">
              <RefreshCcw className="mr-2 h-4 w-4" />
              Retake Quiz
            </Button>
          </div>
        )}

        {!quizComplete && (
          <div className="flex justify-between mt-6 pt-6 border-t">
            <div className="text-sm text-muted-foreground">
              Score: {score}/{currentQuestion + 1}
            </div>
            {!showExplanation ? (
              <Button onClick={handleAnswer} disabled={selectedAnswer === null}>
                Check Answer
              </Button>
            ) : (
              <Button onClick={nextQuestion}>
                {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuizView;