import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare } from "lucide-react"
import { EnhancedChatInterface } from "@/components/chat/enhanced-chat-interface"

export default function DemoPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5">Demo Page</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Existing demo cards would go here */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Interactive Chat Modals
            </CardTitle>
            <CardDescription>
              Chat interface with interactive forms, quizzes, file uploads, and step-by-step processes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EnhancedChatInterface agentName="Swiss Assistant" agentLogo="/placeholder.svg?height=32&width=32" />
          </CardContent>
          <CardFooter>
            <p className="text-sm text-gray-600">Try commands: "form", "quiz", "upload", "setup", "feedback"</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
