export interface Claim {
  _id: string
  retailerName: string
  orderReference: string
  orderDate: string
  amountGBP: number
  status: string
  awardedPoints?: number
  rejectionReason?: string
}

export interface ClaimPointsFormProps {
  retailers: CmsRetailer[]
  open: boolean
  onClose: () => void
}

export interface CmsRetailer {
  _id: string
  name: string
  slug?: {current: string}
  category?: string
  affiliateUrl?: string
  bannerUrl?: string
  banner?: {url?: string; alt?: string} | null
  description?: string
  featured?: boolean
}
