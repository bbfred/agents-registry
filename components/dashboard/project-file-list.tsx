"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  FileText,
  ImageIcon,
  FileArchive,
  FileSpreadsheet,
  FileIcon as FilePdf,
  File,
  Upload,
  MoreHorizontal,
  Download,
  Trash2,
  Share2,
  Eye,
  Plus,
  Loader2,
} from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import type { Project, ProjectFile } from "@/types/dashboard"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"

interface ProjectFileListProps {
  project: Project
  files: ProjectFile[]
  onFileUpload: (file: ProjectFile) => void
  onFileDelete: (fileId: string) => void
}

export function ProjectFileList({ project, files, onFileUpload, onFileDelete }: ProjectFileListProps) {
  const { t } = useLanguage()
  const [isUploading, setIsUploading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredFiles = files.filter((file) => file.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleFileUpload = () => {
    setIsUploading(true)

    // Simulate file upload
    setTimeout(() => {
      const fileTypes = [
        { name: "Report_Q4_2023.pdf", type: "application/pdf", size: 2048000 },
        { name: "Product_Image.png", type: "image/png", size: 1024000 },
        {
          name: "Data_Analysis.xlsx",
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          size: 512000,
        },
        { name: "Project_Archive.zip", type: "application/zip", size: 5120000 },
      ]

      const randomFile = fileTypes[Math.floor(Math.random() * fileTypes.length)]

      const newFile: ProjectFile = {
        id: `file-${Date.now()}`,
        projectId: project.id,
        name: randomFile.name,
        type: randomFile.type,
        size: randomFile.size,
        uploadedAt: new Date(),
        url: `/files/${randomFile.name.toLowerCase().replace(/\s+/g, "-")}`,
      }

      onFileUpload(newFile)
      setIsUploading(false)
    }, 1500)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / 1048576).toFixed(1) + " MB"
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("default", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date)
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) return <ImageIcon className="h-6 w-6 text-blue-500" />
    if (fileType.includes("pdf")) return <FilePdf className="h-6 w-6 text-red-500" />
    if (fileType.includes("spreadsheet") || fileType.includes("excel"))
      return <FileSpreadsheet className="h-6 w-6 text-green-500" />
    if (fileType.includes("zip") || fileType.includes("archive"))
      return <FileArchive className="h-6 w-6 text-yellow-500" />
    if (fileType.includes("document") || fileType.includes("word"))
      return <FileText className="h-6 w-6 text-blue-500" />
    return <File className="h-6 w-6 text-gray-500" />
  }

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="relative w-full md:w-auto">
          <Input
            placeholder={t("search_files")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-[300px]"
          />
        </div>
        <Button onClick={handleFileUpload} disabled={isUploading}>
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {t("uploading")}
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              {t("upload_file")}
            </>
          )}
        </Button>
      </div>

      {filteredFiles.length === 0 ? (
        <div className="text-center py-12 bg-muted/40 rounded-lg">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">{files.length === 0 ? t("no_files_yet") : t("no_files_found")}</h3>
          <p className="text-muted-foreground mb-4">
            {files.length === 0 ? t("upload_first_file") : t("try_different_search")}
          </p>
          <Button onClick={handleFileUpload} disabled={isUploading}>
            <Plus className="h-4 w-4 mr-2" />
            {t("upload_file")}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFiles.map((file) => (
            <Card key={file.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="p-4 flex items-start gap-3">
                  {getFileIcon(file.type)}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{file.name}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-2">
                      <span>{formatFileSize(file.size)}</span>
                      <span>•</span>
                      <span>{formatDate(file.uploadedAt)}</span>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Download className="h-4 w-4 mr-2" />
                        {t("download")}
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        {t("preview")}
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Share2 className="h-4 w-4 mr-2" />
                        {t("share")}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => onFileDelete(file.id)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        {t("delete")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}
