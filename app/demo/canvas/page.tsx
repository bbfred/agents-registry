"use client"

import { useState } from "react"
import { AICanvasInterface } from "@/components/ai-canvas/ai-canvas-interface"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// Sample artifacts for demo
const sampleArtifacts = {
  text: {
    id: "text-doc",
    type: "text" as const,
    title: "Swiss AI Strategy Document",
    content: `# Swiss AI Strategy 2024

## Executive Summary

Switzerland is positioning itself as a global leader in artificial intelligence, leveraging its strengths in research, innovation, and precision engineering.

## Key Objectives

1. **Research Excellence**: Maintain world-class AI research institutions
2. **Industry Adoption**: Accelerate AI adoption across Swiss industries
3. **Ethical Framework**: Develop comprehensive AI ethics guidelines
4. **Talent Development**: Build a skilled AI workforce

## Implementation Timeline

### Phase 1: Foundation (2024)
- Establish AI governance framework
- Launch national AI research initiative
- Create industry partnerships

### Phase 2: Expansion (2025)
- Scale AI education programs
- Deploy AI solutions in public sector
- Strengthen international collaborations

### Phase 3: Leadership (2026)
- Achieve top 3 global AI readiness ranking
- Export Swiss AI expertise globally
- Lead international AI standards development

## Conclusion

By combining Swiss precision with AI innovation, we can create a sustainable and ethical AI ecosystem that benefits all citizens.`,
    metadata: {
      description: "Strategic document outlining Switzerland's AI roadmap",
      tags: ["strategy", "AI", "Switzerland"],
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date(),
      version: 3,
    },
    versions: [
      {
        id: "v1",
        content: "Initial draft of Swiss AI Strategy...",
        timestamp: new Date("2024-01-15"),
        description: "Initial draft",
      },
      {
        id: "v2",
        content: "Revised Swiss AI Strategy with stakeholder feedback...",
        timestamp: new Date("2024-01-20"),
        description: "Added stakeholder feedback",
      },
    ],
  },

  code: {
    id: "code-snippet",
    type: "code" as const,
    title: "Swiss AI Agent API",
    content: `// Swiss AI Agent API Implementation
import { SwissAIAgent } from '@swiss-ai/core';

class SwissAIAgentAPI {
  private agent: SwissAIAgent;
  
  constructor(config: AgentConfig) {
    this.agent = new SwissAIAgent({
      language: config.language || 'de-CH',
      compliance: 'GDPR',
      trustLevel: 'high',
      ...config
    });
  }
  
  async processRequest(request: AIRequest): Promise<AIResponse> {
    // Validate request against Swiss data protection laws
    const validation = await this.validateRequest(request);
    if (!validation.isValid) {
      throw new Error(\`Validation failed: \${validation.reason}\`);
    }
    
    // Process with Swiss-specific context
    const context = {
      locale: 'ch',
      regulations: ['FADP', 'GDPR'],
      culturalContext: this.getCulturalContext(request.language)
    };
    
    return await this.agent.process(request, context);
  }
  
  private async validateRequest(request: AIRequest): Promise<ValidationResult> {
    // Swiss-specific validation logic
    return {
      isValid: true,
      reason: null,
      compliance: ['FADP', 'GDPR']
    };
  }
  
  private getCulturalContext(language: string): CulturalContext {
    const contexts = {
      'de-CH': { formality: 'high', directness: 'medium' },
      'fr-CH': { formality: 'high', directness: 'low' },
      'it-CH': { formality: 'medium', directness: 'medium' },
      'rm-CH': { formality: 'high', directness: 'low' }
    };
    
    return contexts[language] || contexts['de-CH'];
  }
}

export default SwissAIAgentAPI;`,
    language: "typescript",
    metadata: {
      description: "TypeScript implementation of Swiss AI Agent API",
      tags: ["API", "TypeScript", "Swiss", "AI"],
      createdAt: new Date("2024-01-10"),
      updatedAt: new Date(),
      version: 2,
    },
  },

  html: {
    id: "html-component",
    type: "html" as const,
    title: "Swiss AI Dashboard Widget",
    content: `<!DOCTYPE html>
<html lang="de-CH">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Swiss AI Dashboard</title>
    <style>
        .swiss-widget {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #dc143c, #ffffff);
            border-radius: 12px;
            padding: 24px;
            color: #333;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            max-width: 400px;
        }
        .widget-header {
            display: flex;
            align-items: center;
            margin-bottom: 16px;
        }
        .swiss-flag {
            width: 24px;
            height: 24px;
            background: #dc143c;
            position: relative;
            margin-right: 12px;
        }
        .swiss-flag::before,
        .swiss-flag::after {
            content: '';
            position: absolute;
            background: white;
        }
        .swiss-flag::before {
            width: 6px;
            height: 18px;
            left: 9px;
            top: 3px;
        }
        .swiss-flag::after {
            width: 18px;
            height: 6px;
            left: 3px;
            top: 9px;
        }
        .metric {
            display: flex;
            justify-content: space-between;
            margin: 8px 0;
            padding: 8px;
            background: rgba(255,255,255,0.9);
            border-radius: 6px;
        }
        .metric-value {
            font-weight: bold;
            color: #dc143c;
        }
    </style>
</head>
<body>
    <div class="swiss-widget">
        <div class="widget-header">
            <div class="swiss-flag"></div>
            <h3>Swiss AI Metrics</h3>
        </div>
        <div class="metric">
            <span>Active Agents</span>
            <span class="metric-value">1,247</span>
        </div>
        <div class="metric">
            <span>Trust Score</span>
            <span class="metric-value">98.5%</span>
        </div>
        <div class="metric">
            <span>Compliance Rate</span>
            <span class="metric-value">100%</span>
        </div>
        <div class="metric">
            <span>Languages Supported</span>
            <span class="metric-value">4</span>
        </div>
    </div>
</body>
</html>`,
    metadata: {
      description: "HTML widget for Swiss AI dashboard metrics",
      tags: ["HTML", "CSS", "Dashboard", "Swiss"],
      createdAt: new Date("2024-01-12"),
      updatedAt: new Date(),
      version: 1,
    },
  },
}

export default function CanvasDemoPage() {
  const [selectedArtifact, setSelectedArtifact] = useState<keyof typeof sampleArtifacts>("text")

  const handleSave = (artifact: unknown) => {
    console.log("Saving artifact:", artifact)
    // In a real app, this would save to a backend
  }

  const handleExport = (artifact: unknown, format: string) => {
    console.log("Exporting artifact:", artifact, "as", format)
    // In a real app, this would trigger a download
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">AI Canvas Interface Demo</h1>
        <p className="text-muted-foreground mt-2">
          Experience advanced AI artifact editing with side-by-side views, version control, and collaboration features
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-xs space-y-1">
              <div>✓ Side-by-side editing</div>
              <div>✓ Real-time preview</div>
              <div>✓ Version history</div>
              <div>✓ Undo/Redo support</div>
              <div>✓ Multiple view modes</div>
              <div>✓ Export capabilities</div>
              <div>✓ Collaboration ready</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Supported Formats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-xs space-y-1">
              <div>• Text Documents</div>
              <div>• Code (TypeScript, Python, etc.)</div>
              <div>• HTML/CSS</div>
              <div>• Markdown</div>
              <div>• SVG Graphics</div>
              <div>• JSON Data</div>
              <div>• Charts & Visualizations</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">View Modes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-xs space-y-1">
              <div>
                <strong>Split:</strong> Editor + Preview
              </div>
              <div>
                <strong>Edit:</strong> Full editor view
              </div>
              <div>
                <strong>Preview:</strong> Full preview view
              </div>
              <div>
                <strong>Fullscreen:</strong> Immersive editing
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Try Different Artifacts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant={selectedArtifact === "text" ? "default" : "outline"}
              size="sm"
              className="w-full justify-start"
              onClick={() => setSelectedArtifact("text")}
            >
              Text Document
            </Button>
            <Button
              variant={selectedArtifact === "code" ? "default" : "outline"}
              size="sm"
              className="w-full justify-start"
              onClick={() => setSelectedArtifact("code")}
            >
              TypeScript Code
            </Button>
            <Button
              variant={selectedArtifact === "html" ? "default" : "outline"}
              size="sm"
              className="w-full justify-start"
              onClick={() => setSelectedArtifact("html")}
            >
              HTML Widget
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AI Canvas Interface</CardTitle>
          <CardDescription>
            Edit and preview AI-generated content with advanced features like version control, collaboration, and
            multi-format support
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[700px] border rounded-lg overflow-hidden">
            <AICanvasInterface
              initialArtifact={sampleArtifacts[selectedArtifact]}
              onSave={handleSave}
              onExport={handleExport}
              collaborative={true}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
