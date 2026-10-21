import type { Metadata } from 'next';
import PayFlowApp from './PayFlowApp';
import './payflow.css';

export const metadata: Metadata = {
  title: 'PayFlow · Hybrid Wallet & DeFi',
  description:
    'Hybrid PayPal + TNG + Web3 wallet with swaps and yield pools.',
};

export default function PayFlowPage() {
  return <PayFlowApp />;
}
