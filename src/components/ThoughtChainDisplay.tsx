import React, { useState } from 'react';
import { ThoughtChain } from '@ant-design/x';
import type { ThoughtChainProps } from '@ant-design/x';
import { CheckCircleOutlined, LoadingOutlined, CloseCircleOutlined, CrownOutlined } from '@ant-design/icons';
import { Card, Typography, Button, Space, Divider } from 'antd';

const { Text, Paragraph } = Typography;

export interface WorkflowNode {
  id: string;
  title: string;
  status: 'pending' | 'success' | 'error' | 'running';
  elapsed_time?: number;
  inputs?: Record<string, any>;
  outputs?: Record<string, any>;
  error?: string;
  nodeType?: string;
}

interface ThoughtChainDisplayProps {
  nodes: WorkflowNode[];
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'success':
      return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
    case 'error':
      return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
    case 'running':
      return <LoadingOutlined style={{ color: '#1890ff' }} />;
    default:
      return <LoadingOutlined style={{ color: '#d9d9d9' }} />;
  }
};

const getStatusValue = (status: string): 'success' | 'error' | 'pending' | 'wait' => {
  switch (status) {
    case 'success':
      return 'success';
    case 'error':
      return 'error';
    case 'running':
      return 'wait';
    default:
      return 'pending';
  }
};

// Convert technical steps to user-friendly steps
const getSmartStepTitle = (title: string, outputs?: Record<string, any>): string => {
  const lowerTitle = title.toLowerCase();

  if (lowerTitle === 'start') {
    return '🔍 Finding Context';
  }

  if (lowerTitle === 'knowledge-retrieval') {
    const result = outputs?.result;
    if (Array.isArray(result) && result.length > 0) {
      const count = result.length;
      return `📚 Deep Research (${count} ${count === 1 ? 'source' : 'sources'})`;
    }
    return '📚 Deep Research';
  }

  if (lowerTitle === 'llm') {
    return '✨ Generating Answer';
  }

  if (lowerTitle === 'end') {
    return '✓ Complete';
  }

  return title;
};

// Extract knowledge-retrieval content
const extractRetrievedContent = (outputs?: Record<string, any>): string => {
  if (!outputs?.result || !Array.isArray(outputs.result)) return '';
  
  const results = outputs.result as Array<any>;
  if (results.length === 0) return '';

  // Get first few sources' titles
  const titles = results
    .slice(0, 2)
    .map((r) => r.title || r.document_name || 'Unknown')
    .join(', ');

  return `Retrieved from: ${titles}${results.length > 2 ? ` +${results.length - 2} more` : ''}`;
};

// Extract LLM response summary
const extractResponseSummary = (outputs?: Record<string, any>): string => {
  if (!outputs?.text) return '';
  
  const text = outputs.text;
  if (typeof text !== 'string') return '';

  // Get first 80 chars of response
  const summary = text.substring(0, 80).trim();
  return summary + (text.length > 80 ? '...' : '');
};

// Extract query/input
const extractQuery = (outputs?: Record<string, any>): string => {
  if (!outputs?.['sys.query']) return '';
  return outputs['sys.query'];
};

const NodeDetailContent: React.FC<{ node: WorkflowNode }> = ({ node }) => {
  const lowerTitle = node.title.toLowerCase();

  return (
    <div style={{ fontSize: '13px', lineHeight: '1.6' }}>
      {/* For Knowledge Retrieval - show sources */}
      {lowerTitle === 'knowledge-retrieval' && (
        <div style={{ marginBottom: '12px' }}>
          <Text>Analyzed and retrieved relevant information from knowledge base</Text>
          <Divider style={{ margin: '8px 0' }} />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {extractRetrievedContent(node.outputs)}
          </Text>
        </div>
      )}

      {/* For LLM - show response preview */}
      {lowerTitle === 'llm' && (
        <div style={{ marginBottom: '12px' }}>
          <Text>Generated comprehensive response</Text>
          <Divider style={{ margin: '8px 0' }} />
          <Paragraph
            style={{
              fontSize: '12px',
              color: '#666',
              fontStyle: 'italic',
              margin: 0,
              padding: '8px',
              backgroundColor: '#f5f5f5',
              borderRadius: '4px',
              borderLeft: '3px solid #1890ff',
            }}
          >
            "{extractResponseSummary(node.outputs)}"
          </Paragraph>
        </div>
      )}

      {/* Timing info */}
      {node.elapsed_time && (
        <div style={{ marginTop: '8px', color: '#999', fontSize: '12px' }}>
          <Text type="secondary">⏱️ {node.elapsed_time.toFixed(3)}s</Text>
        </div>
      )}

      {/* Error display */}
      {node.error && (
        <div style={{ marginTop: '8px', color: '#ff4d4f' }}>
          <strong>Error:</strong> {node.error}
        </div>
      )}
    </div>
  );
};

export const ThoughtChainDisplay: React.FC<ThoughtChainDisplayProps> = ({ nodes }) => {
  const [expanded, setExpanded] = useState(false);

  // Filter and map nodes to show only meaningful steps
  const items: ThoughtChainProps['items'] = nodes
    .filter((node) => {
      const lowerTitle = node.title.toLowerCase();
      return lowerTitle !== 'start' || node.status === 'error';
    })
    .map((node) => ({
      title: getSmartStepTitle(node.title, node.outputs),
      status: getStatusValue(node.status),
      icon: getStatusIcon(node.status),
      content: <NodeDetailContent node={node} />,
    }));

  // Only show thought chain if there are meaningful steps
  if (  items.length === 0) {
    return null;
  }

  return (
    <div style={{ marginBottom: '12px' }}>
      {/* Collapsible header */}
      <Button
        type="text"
        block
        style={{
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          backgroundColor: '#f9fafb',
          border: '1px solid #e5e7eb',
          borderRadius: '6px 6px 0 0',
          borderBottom: expanded ? 'none' : '1px solid #e5e7eb',
          fontWeight: 500,
          color: '#6b7280',
          fontSize: '13px',
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <span>💭 Thinking Process ({items.length} steps)</span>
        {expanded ? <CrownOutlined /> : <CrownOutlined />}
      </Button>

      {/* Expandable content */}
      {expanded && (
        <Card
          size="small"
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '0 0 6px 6px',
            borderTop: 'none',
            marginBottom: 0,
          }}
          bodyStyle={{ padding: '12px', overflow: 'hidden' }}
        >
          <ThoughtChain items={items} />
        </Card>
      )}
    </div>
  );
};