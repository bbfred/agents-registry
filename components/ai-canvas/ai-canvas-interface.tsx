"use client"

import { useState, useRef } from "react"
import {
  Edit3,
  Download,
  History,
  Undo,
  Redo,
  Save,
  Code,
  FileText,
  ImageIcon,
  BarChart3,
  Layout,
  Maximize2,
  Minimize2,
  Split,
  Eye,
  MessageSquare,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"

// Types for the AI Canvas
interface Artifact {
  id: string
  type: "text" | "code" | "html" | "svg" | "markdown" | "json" | "chart" | "ui-design"
  title: string
  content: string
  language?: string
  metadata?: {
    description?: string
    tags?: string[]
    createdAt: Date
    updatedAt: Date
    version: number
  }
  versions?: ArtifactVersion[]
}

interface ArtifactVersion {
  id: string
  content: string
  timestamp: Date
  description?: string
}

interface CanvasComment {
  id: string
  content: string
  position: { x: number; y: number }
  author: string
  timestamp: Date
  resolved?: boolean
}

export function AICanvasInterface({
  initialArtifact,
  onSave,
  onExport,
}: {
  initialArtifact?: Artifact
  onSave?: (artifact: Artifact) => void
  onExport?: (artifact: Artifact, format: string) => void
  collaborative?: boolean
}) {
  const [artifact, setArtifact] = useState<Artifact>(
    initialArtifact || {
      id: "new-artifact",
      type: "text",
      title: "New Document",
      content: "Start writing your content here...",
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1,
        tags: [],
      },
      versions: [],
    },
  )

  const [viewMode, setViewMode] = useState<"split" | "edit" | "preview">("split")
  const [showComments, setShowComments] = useState(false)
  const [comments] = useState<CanvasComment[]>([])
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [undoStack, setUndoStack] = useState<string[]>([])
  const [redoStack, setRedoStack] = useState<string[]>([])

  const editorRef = useRef<HTMLTextAreaElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)

  // Handle content changes with undo/redo support
  const handleContentChange = (newContent: string) => {
    setUndoStack((prev) => [...prev, artifact.content])
    setRedoStack([]) // Clear redo stack when new change is made

    setArtifact((prev) => ({
      ...prev,
      content: newContent,
      metadata: {
        ...prev.metadata!,
        updatedAt: new Date(),
        version: prev.metadata!.version + 1,
      },
    }))
  }

  // Undo functionality
  const handleUndo = () => {
    if (undoStack.length > 0) {
      const previousContent = undoStack[undoStack.length - 1]
      setRedoStack((prev) => [artifact.content, ...prev])
      setUndoStack((prev) => prev.slice(0, -1))

      setArtifact((prev) => ({
        ...prev,
        content: previousContent,
      }))
    }
  }

  // Redo functionality
  const handleRedo = () => {
    if (redoStack.length > 0) {
      const nextContent = redoStack[0]
      setUndoStack((prev) => [...prev, artifact.content])
      setRedoStack((prev) => prev.slice(1))

      setArtifact((prev) => ({
        ...prev,
        content: nextContent,
      }))
    }
  }

  // Save version
  const saveVersion = (description?: string) => {
    const newVersion: ArtifactVersion = {
      id: `v${artifact.metadata!.version}`,
      content: artifact.content,
      timestamp: new Date(),
      description,
    }

    setArtifact((prev) => ({
      ...prev,
      versions: [...(prev.versions || []), newVersion],
    }))

    if (onSave) {
      onSave(artifact)
    }
  }

  // Render preview based on artifact type
  const renderPreview = () => {
    switch (artifact.type) {
      case "html":
        return <div className="w-full h-full p-4 bg-white" dangerouslySetInnerHTML={{ __html: artifact.content }} />

      case "markdown":
        return (
          <div className="w-full h-full p-4 prose prose-sm max-w-none">
            {/* In a real implementation, you'd use a markdown parser */}
            <pre className="whitespace-pre-wrap">{artifact.content}</pre>
          </div>
        )

      case "code":
        return (
          <div className="w-full h-full">
            <pre className="p-4 bg-gray-900 text-green-400 text-sm overflow-auto h-full">
              <code>{artifact.content}</code>
            </pre>
          </div>
        )

      case "svg":
        return (
          <div className="w-full h-full flex items-center justify-center p-4">
            <div dangerouslySetInnerHTML={{ __html: artifact.content }} />
          </div>
        )

      case "chart":
        return (
          <div className="w-full h-full flex items-center justify-center p-4">
            <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
              <BarChart3 className="h-16 w-16 text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Chart Preview</span>
            </div>
          </div>
        )

      default:
        return (
          <div className="w-full h-full p-4">
            <div className="whitespace-pre-wrap text-sm">{artifact.content}</div>
          </div>
        )
    }
  }

  // Get icon for artifact type
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "code":
        return <Code className="h-4 w-4" />
      case "html":
        return <Layout className="h-4 w-4" />
      case "markdown":
        return <FileText className="h-4 w-4" />
      case "svg":
        return <ImageIcon className="h-4 w-4" />
      case "chart":
        return <BarChart3 className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className={`flex flex-col h-full ${isFullscreen ? "fixed inset-0 z-50 bg-background" : ""}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {getTypeIcon(artifact.type)}
            <Input
              value={artifact.title}
              onChange={(e) => setArtifact((prev) => ({ ...prev, title: e.target.value }))}
              className="font-medium border-none p-0 h-auto focus-visible:ring-0"
            />
          </div>

          <Badge variant="outline">v{artifact.metadata?.version}</Badge>

          <Badge variant="secondary">{artifact.type.toUpperCase()}</Badge>
        </div>

        <div className="flex items-center space-x-2">
          {/* View Mode Controls */}
          <div className="flex items-center border rounded-md">
            <Button
              variant={viewMode === "edit" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("edit")}
              className="rounded-r-none"
            >
              <Edit3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "split" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("split")}
              className="rounded-none border-x"
            >
              <Split className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "preview" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("preview")}
              className="rounded-l-none"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Edit Controls */}
          <Button variant="ghost" size="sm" onClick={handleUndo} disabled={undoStack.length === 0}>
            <Undo className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size="sm" onClick={handleRedo} disabled={redoStack.length === 0}>
            <Redo className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-6" />

          {/* Action Controls */}
          <Button variant="ghost" size="sm" onClick={() => setShowComments(!showComments)}>
            <MessageSquare className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size="sm" onClick={() => saveVersion("Manual save")}>
            <Save className="h-4 w-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onExport?.(artifact, "txt")}>Export as Text</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onExport?.(artifact, "html")}>Export as HTML</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onExport?.(artifact, "pdf")}>Export as PDF</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="sm" onClick={() => setIsFullscreen(!isFullscreen)}>
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>

          {isFullscreen && (
            <Button variant="ghost" size="sm" onClick={() => setIsFullscreen(false)}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 overflow-hidden">
        {viewMode === "split" ? (
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={50} minSize={30}>
              <div className="h-full flex flex-col">
                <div className="p-2 border-b bg-muted/50">
                  <span className="text-sm font-medium">Editor</span>
                </div>
                <Textarea
                  ref={editorRef}
                  value={artifact.content}
                  onChange={(e) => handleContentChange(e.target.value)}
                  className="flex-1 resize-none border-none focus-visible:ring-0 font-mono text-sm"
                  placeholder="Start creating your content..."
                />
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={50} minSize={30}>
              <div className="h-full flex flex-col">
                <div className="p-2 border-b bg-muted/50">
                  <span className="text-sm font-medium">Preview</span>
                </div>
                <div ref={previewRef} className="flex-1 overflow-auto">
                  {renderPreview()}
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        ) : viewMode === "edit" ? (
          <div className="h-full flex flex-col">
            <div className="p-2 border-b bg-muted/50">
              <span className="text-sm font-medium">Editor</span>
            </div>
            <Textarea
              ref={editorRef}
              value={artifact.content}
              onChange={(e) => handleContentChange(e.target.value)}
              className="flex-1 resize-none border-none focus-visible:ring-0 font-mono text-sm"
              placeholder="Start creating your content..."
            />
          </div>
        ) : (
          <div className="h-full flex flex-col">
            <div className="p-2 border-b bg-muted/50">
              <span className="text-sm font-medium">Preview</span>
            </div>
            <div ref={previewRef} className="flex-1 overflow-auto">
              {renderPreview()}
            </div>
          </div>
        )}
      </div>

      {/* Version History Sidebar */}
      {showComments && (
        <div className="w-80 border-l bg-muted/20 p-4">
          <Tabs defaultValue="versions" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="versions">
                <History className="h-4 w-4 mr-2" />
                Versions
              </TabsTrigger>
              <TabsTrigger value="comments">
                <MessageSquare className="h-4 w-4 mr-2" />
                Comments
              </TabsTrigger>
            </TabsList>

            <TabsContent value="versions" className="space-y-2">
              <div className="space-y-2">
                {artifact.versions?.map((version) => (
                  <Card key={version.id} className="p-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{version.id}</Badge>
                      <span className="text-xs text-muted-foreground">{version.timestamp.toLocaleTimeString()}</span>
                    </div>
                    {version.description && <p className="text-sm mt-1">{version.description}</p>}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 w-full"
                      onClick={() => setArtifact((prev) => ({ ...prev, content: version.content }))}
                    >
                      Restore
                    </Button>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="comments" className="space-y-2">
              <div className="space-y-2">
                {comments.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No comments yet</p>
                ) : (
                  comments.map((comment) => (
                    <Card key={comment.id} className="p-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{comment.author}</span>
                        <span className="text-xs text-muted-foreground">{comment.timestamp.toLocaleTimeString()}</span>
                      </div>
                      <p className="text-sm mt-1">{comment.content}</p>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}
