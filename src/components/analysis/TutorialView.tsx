
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Code } from "@/components/ui/code";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TutorialViewProps {
  data: any;
  role: string;
}

const TutorialView = ({ data, role }: TutorialViewProps) => {
  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tutorial</CardTitle>
          <CardDescription>
            No tutorial data available.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTitle>No Data</AlertTitle>
            <AlertDescription>
              There is no tutorial data to display. Please check back later.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">{data.title}</CardTitle>
        <CardDescription>
          {data.overview}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Prerequisites</h3>
          <ul className="list-disc list-inside">
            {data.prerequisites.map((prerequisite: string, index: number) => (
              <li key={index}>{prerequisite}</li>
            ))}
          </ul>
        </div>
        {data.steps.map((step: any, index: number) => (
          <div key={index} className="mb-6">
            <h4 className="text-xl font-semibold mb-2">
              Step {index + 1}: {step.title}
            </h4>
            <p className="mb-2">{step.description}</p>
            {step.codeExample && (
              <ScrollArea className="mb-3 w-full rounded-md border">
                <Code className="block">
                  {step.codeExample}
                </Code>
              </ScrollArea>
            )}
            <p className="mb-2">
              <Badge variant="default" className="mr-2">Explanation</Badge>
              {step.explanation}
            </p>
            {step.keyTakeaways && step.keyTakeaways.length > 0 && (
              <div className="mb-2">
                <Badge variant="secondary" className="mb-1">Key Takeaways</Badge>
                <ul className="list-disc list-inside">
                  {step.keyTakeaways.map((takeaway: string, i: number) => (
                    <li key={i}>{takeaway}</li>
                  ))}
                </ul>
              </div>
            )}
            {step.commonMistakes && step.commonMistakes.length > 0 && (
              <div className="mb-2">
                <Badge variant="destructive" className="mb-1">Common Mistakes</Badge>
                <ul className="list-disc list-inside">
                  {step.commonMistakes.map((mistake: string, i: number) => (
                    <li key={i}>{mistake}</li>
                  ))}
                </ul>
              </div>
            )}
            {step.checkpointQuestion && (
              <Alert>
                <AlertTitle>Checkpoint Question</AlertTitle>
                <AlertDescription>
                  {step.checkpointQuestion.question}
                  <br />
                  <Badge variant="default">Answer</Badge> {step.checkpointQuestion.answer}
                  <br />
                  <Badge variant="secondary">Hint</Badge> {step.checkpointQuestion.hint}
                </AlertDescription>
              </Alert>
            )}
          </div>
        ))}
        {data.additionalNotes && (
          <div>
            <h4 className="text-lg font-semibold">Additional Notes</h4>
            <p>{data.additionalNotes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TutorialView;
