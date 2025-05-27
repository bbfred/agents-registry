"use client"

import { useState } from "react"
import {
  File,
  ImageIcon,
  FileText,
  FileCode,
  FileSpreadsheet,
  FilePlus,
  FolderPlus,
  Search,
  MoreHorizontal,
  Download,
  Trash2,
  Share2,
  Eye,
  Edit2,
  Grid,
  List,
} from "lucide-react"

import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"

// Types for the file interface
interface FileItem {
  id: string
  name: string
  type: "image" | "document" | "code" | "spreadsheet" | "other"
  size: number
  lastModified: Date
  thumbnail?: string
  tags?: string[]
  aiGenerated?: boolean
}

export function FileManagementInterface({
  files = [],
  onUploadFile,
  onCreateFolder,
}: {
  files?: FileItem[]
  onUploadFile?: () => void
  onCreateFolder?: () => void
}) {
  const { t } = useLanguage()
  const [fileList] = useState<FileItem[]>(files)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("name")

  // Filter files based on search query
  const filteredFiles = fileList.filter((file) => file.name.toLowerCase().includes(searchQuery.toLowerCase()))

  // Sort files based on sort option
  const sortedFiles = [...filteredFiles].sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name)
    } else if (sortBy === "date") {
      return b.lastModified.getTime() - a.lastModified.getTime()
    } else if (sortBy === "size") {
      return b.size - a.size
    }
    return 0
  })

  // Get file icon based on file type
  const getFileIcon = (type: FileItem["type"]) => {
    switch (type) {
      case "image":
        return <ImageIcon className="h-6 w-6 text-blue-500" />
      case "document":
        return <FileText className="h-6 w-6 text-green-500" />
      case "code":
        return <FileCode className="h-6 w-6 text-purple-500" />
      case "spreadsheet":
        return <FileSpreadsheet className="h-6 w-6 text-orange-500" />
      default:
        return <File className="h-6 w-6 text-gray-500" />
    }
  }

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / 1048576).toFixed(1) + " MB"
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-4">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <h2 className="text-xl font-semibold">{t("files.title")}</h2>

          <div className="flex space-x-2">
            <Button onClick={onUploadFile}>
              <FilePlus className="mr-2 h-4 w-4" />
              {t("files.upload")}
            </Button>
            <Button variant="outline" onClick={onCreateFolder}>
              <FolderPlus className="mr-2 h-4 w-4" />
              {t("files.createFolder")}
            </Button>
          </div>
        </div>

        <div className="mt-4 flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t("files.search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t("files.sortBy")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">{t("files.sortByName")}</SelectItem>
                <SelectItem value="date">{t("files.sortByDate")}</SelectItem>
                <SelectItem value="size">{t("files.sortBySize")}</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex rounded-md border">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                className="rounded-none rounded-l-md"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                className="rounded-none rounded-r-md"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="all" className="mt-4">
          <TabsList>
            <TabsTrigger value="all">{t("files.all")}</TabsTrigger>
            <TabsTrigger value="images">{t("files.images")}</TabsTrigger>
            <TabsTrigger value="documents">{t("files.documents")}</TabsTrigger>
            <TabsTrigger value="ai-generated">{t("files.aiGenerated")}</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {sortedFiles.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="rounded-full bg-muted p-3">
                <File className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="mt-3 text-lg font-medium">{t("files.noFiles")}</h3>
              <p className="text-center text-sm text-muted-foreground">{t("files.noFilesDescription")}</p>
              <Button className="mt-4" onClick={onUploadFile}>
                <FilePlus className="mr-2 h-4 w-4" />
                {t("files.upload")}
              </Button>
            </CardContent>
          </Card>
        ) : viewMode === "grid" ? (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {sortedFiles.map((file) => (
              <Card key={file.id} className="overflow-hidden">
                <div className="aspect-square bg-muted">
                  {file.type === "image" && file.thumbnail ? (
                    <img
                      src={file.thumbnail || "/placeholder.svg"}
                      alt={file.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">{getFileIcon(file.type)}</div>
                  )}
                </div>
                <CardContent className="p-3">
                  <div className="flex items-start justify-between">
                    <div className="truncate">
                      <div className="truncate font-medium">{file.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)} •{" "}
                        {new Intl.DateTimeFormat("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }).format(file.lastModified)}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          <span>{t("files.preview")}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          <span>{t("files.download")}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share2 className="mr-2 h-4 w-4" />
                          <span>{t("files.share")}</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Edit2 className="mr-2 h-4 w-4" />
                          <span>{t("files.rename")}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>{t("files.delete")}</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {((file.tags && file.tags.length > 0) || file.aiGenerated) && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {file.aiGenerated && (
                        <Badge variant="secondary" className="text-xs">
                          AI Generated
                        </Badge>
                      )}
                      {file.tags?.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {sortedFiles.map((file) => (
              <div key={file.id} className="flex items-center justify-between rounded-md border p-3 hover:bg-muted/50">
                <div className="flex items-center space-x-3">
                  {getFileIcon(file.type)}
                  <div>
                    <div className="font-medium">{file.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)} •{" "}
                      {new Intl.DateTimeFormat("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }).format(file.lastModified)}
                    </div>
                  </div>

                  {((file.tags && file.tags.length > 0) || file.aiGenerated) && (
                    <div className="ml-4 flex flex-wrap gap-1">
                      {file.aiGenerated && (
                        <Badge variant="secondary" className="text-xs">
                          AI Generated
                        </Badge>
                      )}
                      {file.tags?.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Download className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Share2 className="mr-2 h-4 w-4" />
                        <span>{t("files.share")}</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit2 className="mr-2 h-4 w-4" />
                        <span>{t("files.rename")}</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>{t("files.delete")}</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
