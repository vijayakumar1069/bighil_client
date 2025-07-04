import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { House, Menu, Pause, TrendingUp, Users } from "lucide-react";

export default function ClientStatisticsLayout({
  children,
  client_summary,
  monthly_trends,
  category_breakdown,
  department_breakdown,
  stalled_breakdown,
  // pattern_and_escalation,
}) {
  return (
    <div className="min-h-screen text-black bg-gradient-to-br from-slate-50 to-slate-100 dark:from-neutral-950 dark:via-emerald-950/20 dark:to-neutral-950 m-5">
      {children}
      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="grid w-full grid-cols-6 gap-2 mb-6">
          <TabsTrigger
            value="summary"
            className="flex items-center gap-2 shadow-xl bg-gray/10"
          >
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Summary</span>
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Trends</span>
          </TabsTrigger>
          <TabsTrigger value="category" className="flex items-center gap-2">
            <Menu className="h-4 w-4" />
            <span className="hidden sm:inline">Category</span>
          </TabsTrigger>
          <TabsTrigger value="department" className="flex items-center gap-2">
            <House className="h-4 w-4" />
            <span className="hidden sm:inline">Department</span>
          </TabsTrigger>
          <TabsTrigger value="stalled" className="flex items-center gap-2">
            <Pause className="h-4 w-4" />
            <span className="hidden sm:inline">Stalled</span>
          </TabsTrigger>
          {/* <TabsTrigger value="pattern" className="flex items-center gap-2">
            <Pause className="h-4 w-4" />
            <span className="hidden sm:inline">Pattern & Escalation</span>
          </TabsTrigger> */}
        </TabsList>

        <TabsContent value="summary" className="space-y-4">
          <Card className="p-0 border-none">
            <CardContent className=" p-0 border-none">
              {client_summary}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card className="p-0 border-none">
            <CardContent className="p-1">{monthly_trends}</CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="category" className="space-y-4">
          <Card className="p-0 border-none">
            <CardContent className="p-1">{category_breakdown}</CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="department" className="space-y-4">
          <Card className="p-0 border-none">
            <CardContent className="p-1">{department_breakdown}</CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="stalled" className="space-y-4">
          <Card className="p-0 border-none">
            <CardContent className="p-1">{stalled_breakdown}</CardContent>
          </Card>
        </TabsContent>
        {/* <TabsContent value="pattern" className="space-y-4">
          <Card className="p-0 border-none">
            <CardContent className="p-1">{pattern_and_escalation}</CardContent>
          </Card>
        </TabsContent> */}
      </Tabs>
    </div>
  );
}
