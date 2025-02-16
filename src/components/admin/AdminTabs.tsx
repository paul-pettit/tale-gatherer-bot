
import { Users, BookOpen, DollarSign, Terminal, Bot, HelpCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UsersTable } from "./UsersTable";
import { StoriesTable } from "./StoriesTable";
import { PaymentsTable } from "./PaymentsTable";
import { PromptLogsTable } from "./PromptLogsTable";
import { SystemPromptsTable } from "./SystemPromptsTable";
import { QuestionsTable } from "./QuestionsTable";

interface AdminTabsProps {
  profiles: any[];
  stories: any[];
  payments: any[];
  promptLogs: any[];
  systemPrompts: any[];
  questions: any[];
}

export function AdminTabs({
  profiles,
  stories,
  payments,
  promptLogs,
  systemPrompts,
  questions,
}: AdminTabsProps) {
  return (
    <Tabs defaultValue="users" className="space-y-6">
      <TabsList>
        <TabsTrigger value="users" className="flex items-center">
          <Users className="w-4 h-4 mr-2" />
          Users
        </TabsTrigger>
        <TabsTrigger value="stories" className="flex items-center">
          <BookOpen className="w-4 h-4 mr-2" />
          Stories
        </TabsTrigger>
        <TabsTrigger value="payments" className="flex items-center">
          <DollarSign className="w-4 h-4 mr-2" />
          Payments
        </TabsTrigger>
        <TabsTrigger value="prompts" className="flex items-center">
          <Terminal className="w-4 h-4 mr-2" />
          Prompts
        </TabsTrigger>
        <TabsTrigger value="questions" className="flex items-center">
          <HelpCircle className="w-4 h-4 mr-2" />
          Questions
        </TabsTrigger>
        <TabsTrigger value="ai" className="flex items-center">
          <Bot className="w-4 h-4 mr-2" />
          AI Settings
        </TabsTrigger>
      </TabsList>

      <TabsContent value="users">
        <UsersTable profiles={profiles} />
      </TabsContent>

      <TabsContent value="stories">
        <StoriesTable stories={stories} />
      </TabsContent>

      <TabsContent value="payments">
        <PaymentsTable payments={payments} />
      </TabsContent>

      <TabsContent value="prompts">
        <PromptLogsTable logs={promptLogs} />
      </TabsContent>

      <TabsContent value="questions">
        <QuestionsTable questions={questions} />
      </TabsContent>

      <TabsContent value="ai">
        <SystemPromptsTable prompts={systemPrompts} />
      </TabsContent>
    </Tabs>
  );
}
