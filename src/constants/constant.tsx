import {
  SafetyOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  LeftOutlined,
} from '@ant-design/icons';

export const HOT_TOPICS = [
  {
    key: '1',
    icon: <SafetyOutlined style={{ color: '#FF6B35' }} />,
    label: 'Safety & Security',
    description: 'What are ENEC safety and security requirements?',
  },
  {
    key: '2',
    icon: <TeamOutlined style={{ color: '#004E89' }} />,
    label: 'Career & Development',
    description: 'Tell me about Emiratization and career opportunities',
  },
  {
    key: '3',
    icon: <CheckCircleOutlined style={{ color: '#7209B7' }} />,
    label: 'Policies & Compliance',
    description: 'What are ENEC governance and compliance policies?',
  },
  {
    key: '4',
    icon: <LeftOutlined style={{ color: '#06A77D' }} />,
    label: 'Sustainability',
    description: 'How is ENEC committed to clean nuclear energy?',
  },
];