import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Wallet as WalletType } from "@shared/schema";

export default function Wallet() {
  const [wallet, setWallet] = useState<WalletType | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const { toast } = useToast();
  
  const getWallet = async () => {
    try {
      const response = await fetch('/api/wallet');
      if (response.ok) {
        const data = await response.json();
        setWallet(data);
      }
    } catch (error) {
      console.error('Failed to fetch wallet', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    getWallet();
  }, []);
  
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };
  
  const requestBtc = async () => {
    try {
      setUpdating(true);
      setShowStatus(true);
      
      await fetch('/api/wallet/get-btc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      
      // Wait for balance update
      setTimeout(async () => {
        await getWallet();
        setUpdating(false);
        
        toast({
          title: "Success!",
          description: "10 BTC has been added to your wallet on Bitcoin Mainnet"
        });
      }, 3000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get BTC",
        variant: "destructive"
      });
      setUpdating(false);
    }
  };
  
  if (loading) {
    return (
      <div className="p-4">
        <div className="card-container">
          <Skeleton className="h-6 w-1/3 mb-2" />
          <Skeleton className="h-10 w-1/2 mb-4" />
          <Skeleton className="h-4 w-3/4 mb-6" />
          <div className="mb-4 space-y-4">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-8 w-16" />
            </div>
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-8 w-16" />
            </div>
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }
  
  if (!wallet) {
    return (
      <div className="p-4">
        <div className="card-container">
          <h2 className="section-title">Wallet Not Found</h2>
          <p className="text-gray-600 mb-4">
            You don't have a wallet set up yet. Please go to the setup page to create a wallet.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-4">
      <div className="card-container">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-medium">Balance</h3>
            <div className="text-2xl font-bold">{wallet.balance} BTC</div>
            <div className="text-sm text-gray-600">Unconfirmed: {wallet.unconfirmedBalance} BTC</div>
          </div>
          {updating && (
            <div className="animate-spin">
              <Loader2 className="h-6 w-6 text-primary" />
            </div>
          )}
        </div>
        
        <div className="text-sm mb-4">
          <div className="mb-2">
            <span className="text-gray-600 block mb-1">Address</span>
            <div className="flex items-center bg-gray-50 p-2 rounded-md">
              <span 
                className="text-xs mr-2 w-full break-all cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors" 
                onClick={() => copyToClipboard(wallet.address, "Address")}
              >
                {wallet.address}
              </span>
              <button 
                className="app-button-sm ml-auto"
                onClick={() => copyToClipboard(wallet.address, "Address")}
              >
                COPY
              </button>
            </div>
          </div>
          
          <div className="mb-2">
            <span className="text-gray-600 block mb-1">Wallet Seed</span>
            <div className="flex items-center bg-gray-50 p-2 rounded-md">
              <span 
                className="text-xs mr-2 w-full break-all cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors" 
                onClick={() => copyToClipboard(wallet.seed, "Seed")}
              >
                {wallet.seed}
              </span>
              <button 
                className="app-button-sm ml-auto"
                onClick={() => copyToClipboard(wallet.seed, "Seed")}
              >
                COPY
              </button>
            </div>
          </div>
          
          <div className="mb-2">
            <span className="text-gray-600 block mb-1">Public Key</span>
            <div className="flex items-center bg-gray-50 p-2 rounded-md">
              <span 
                className="text-xs mr-2 w-full break-all cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors"
                onClick={() => copyToClipboard(wallet.publicKey, "Public Key")}
              >
                {wallet.publicKey}
              </span>
              <button 
                className="app-button-sm ml-auto"
                onClick={() => copyToClipboard(wallet.publicKey, "Public Key")}
              >
                COPY
              </button>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Network</span>
            <span>{wallet.network || "mainnet"} Network</span>
          </div>
        </div>
        
        <Button 
          className="app-button w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 text-lg"
          onClick={requestBtc}
          disabled={updating}
        >
          GET 10 BTC
        </Button>
        
        {showStatus && (
          <div className="text-center text-sm text-gray-600 mt-2">
            It can take up to a minute to register in your balance
          </div>
        )}
        
        <div className="mt-4 bg-gray-100 p-3 rounded-md">
          <p className="text-sm text-gray-700 font-medium">
            ⚡ Running on Bitcoin Mainnet
          </p>
        </div>
      </div>
    </div>
  );
}
