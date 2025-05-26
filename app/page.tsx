"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Download, Wifi, Copy, Check } from "lucide-react"
import QRCode from "react-qr-code"

export default function WiFiCardGenerator() {
  const [networkName, setNetworkName] = useState("")
  const [password, setPassword] = useState("")
  const [securityType, setSecurityType] = useState("WPA")
  const [isHidden, setIsHidden] = useState(false)
  const [cardTitle, setCardTitle] = useState("Guest WiFi")
  const [copied, setCopied] = useState(false)

  // Generate WiFi QR code string
  const generateWiFiString = () => {
    const security = securityType === "None" ? "nopass" : securityType
    const hidden = isHidden ? "true" : "false"
    return `WIFI:T:${security};S:${networkName};P:${password};H:${hidden};;`
  }

  const handleCopyPassword = async () => {
    try {
      await navigator.clipboard.writeText(password)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy password:", err)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const isFormValid = networkName.trim() !== "" && (securityType === "None" || password.trim() !== "")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">WiFi Card Generator</h1>
          <p className="text-gray-600">Create QR codes and printable cards for easy WiFi sharing</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wifi className="w-5 h-5" />
                WiFi Network Details
              </CardTitle>
              <CardDescription>Enter your WiFi network information to generate a QR code</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardTitle">Card Title</Label>
                <Input
                  id="cardTitle"
                  value={cardTitle}
                  onChange={(e) => setCardTitle(e.target.value)}
                  placeholder="e.g., Guest WiFi, Home Network"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="networkName">Network Name (SSID) *</Label>
                <Input
                  id="networkName"
                  value={networkName}
                  onChange={(e) => setNetworkName(e.target.value)}
                  placeholder="Enter WiFi network name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="securityType">Security Type</Label>
                <Select value={securityType} onValueChange={setSecurityType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WPA">WPA/WPA2</SelectItem>
                    <SelectItem value="WEP">WEP</SelectItem>
                    <SelectItem value="None">None (Open)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {securityType !== "None" && (
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter WiFi password"
                  />
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Checkbox id="hidden" checked={isHidden} onCheckedChange={setIsHidden} />
                <Label htmlFor="hidden">Hidden Network</Label>
              </div>
            </CardContent>
          </Card>

          {/* Preview Section */}
          <Card>
            <CardHeader>
              <CardTitle>WiFi Card Preview</CardTitle>
              <CardDescription>This is how your WiFi card will look when printed</CardDescription>
            </CardHeader>
            <CardContent>
              {isFormValid ? (
                <div className="space-y-4">
                  {/* WiFi Card */}
                  <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 print:border-solid print:border-gray-400">
                    <div className="text-center space-y-4">
                      <h2 className="text-2xl font-bold text-gray-900">{cardTitle}</h2>

                      <div className="flex justify-center">
                        <div className="bg-white p-4 rounded-lg shadow-sm border">
                          <QRCode value={generateWiFiString()} size={200} level="M" includeMargin={true} />
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-600">Network:</span>
                          <span className="font-mono bg-gray-100 px-2 py-1 rounded">{networkName}</span>
                        </div>

                        {securityType !== "None" && (
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-600">Password:</span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono bg-gray-100 px-2 py-1 rounded">{password}</span>
                              <Button size="sm" variant="ghost" onClick={handleCopyPassword} className="h-6 w-6 p-0">
                                {copied ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                              </Button>
                            </div>
                          </div>
                        )}

                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-600">Security:</span>
                          <span className="bg-gray-100 px-2 py-1 rounded text-xs">{securityType}</span>
                        </div>
                      </div>

                      <Separator />

                      <p className="text-xs text-gray-500">
                        Scan the QR code with your phone's camera to connect automatically
                      </p>
                    </div>
                  </div>

                  <Button onClick={handlePrint} className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Print WiFi Card
                  </Button>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Wifi className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Fill in the network details to generate your WiFi card</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>How to Use</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2">
                  <span className="font-bold text-blue-600">1</span>
                </div>
                <h3 className="font-medium mb-1">Enter Details</h3>
                <p className="text-gray-600">Fill in your WiFi network name and password</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2">
                  <span className="font-bold text-blue-600">2</span>
                </div>
                <h3 className="font-medium mb-1">Print Card</h3>
                <p className="text-gray-600">Click print to create a physical WiFi card</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2">
                  <span className="font-bold text-blue-600">3</span>
                </div>
                <h3 className="font-medium mb-1">Share & Scan</h3>
                <p className="text-gray-600">Guests can scan the QR code to connect instantly</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:border-solid,
          .print\\:border-solid * {
            visibility: visible;
          }
          .print\\:border-solid {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  )
}
