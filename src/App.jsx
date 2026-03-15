import { Analytics } from "@vercel/analytics/react";
import { Flame, Zap, RotateCcw, MapPin, ExternalLink, Truck, Package } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ImageSlider } from "@/components/ui/image-slider";
import { PRODUCTS } from "./lib/product";


// ── Proper Vite fix: import images as assets so bundler resolves them correctly
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIconUrl from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import NavbarPage from "../app/navbar-component-01/page";
import { CardFooter } from "./components/ui/card";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIconUrl,
  shadowUrl: markerShadow,
});

// Google Maps-style red teardrop pin
const googlePin = new L.DivIcon({
  className: "",
  iconSize: [36, 48],
  iconAnchor: [18, 48],
  popupAnchor: [0, -50],
  html: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 48" width="36" height="48">
      <defs>
        <filter id="pin-shadow" x="-30%" y="-10%" width="160%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#00000055"/>
        </filter>
      </defs>
      <path
        filter="url(#pin-shadow)"
        d="M18 0C8.06 0 0 8.06 0 18c0 13.5 18 30 18 30S36 31.5 36 18C36 8.06 27.94 0 18 0z"
        fill="#EA4335"
      />
      <circle cx="18" cy="18" r="7" fill="white"/>
    </svg>
  `,
});

const STORE_POSITION = [21.1233125, 72.8416875]; // MS Electrical, Bhestan, Surat

const WA_ICON = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

function DeliveryCards() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-4 pb-3 px-4">
          <Truck className="w-5 h-5 text-primary mb-1.5" />
          <p className="text-xs font-bold text-primary uppercase tracking-wide">Free Delivery</p>
          <p className="text-xs text-muted-foreground mt-0.5">Within Surat</p>
        </CardContent>
      </Card>
      <Card className="border-chart-3/20 bg-chart-3/5">
        <CardContent className="pt-4 pb-3 px-4">
          <Package className="w-5 h-5 text-chart-3 mb-1.5" />
          <p className="text-xs font-bold text-chart-3 uppercase tracking-wide">₹100 Delivery</p>
          <p className="text-xs text-muted-foreground mt-0.5">Pan India</p>
        </CardContent>
      </Card>
    </div>
  );
}


export default function App() {


  return (
    <div className="min-h-screen text-foreground py-8">
      <NavbarPage/>
      <div className="max-w-xl mx-auto space-x-10 space-y-4">

        {/* Header */}
        

        {/* LPG + Induction Cards */}
        { /* Section intentionally commented out so users see the deals quicker */ }
        

           
            
        {/* Verdict Banner */}
       

        {/* Note */}
        

        {/* ── Product Sell Section ── */}
        {PRODUCTS.map((product) => {
          const saving = Math.max(0, product.mrp - product.ourPrice);
          const pctOff = product.mrp ? Math.round((saving / product.mrp) * 100) : 0;

          return (
            <div key={product.id} className='relative max-w-7xl rounded-xl  px-10 py-6 shadow-lg'>
              <div className='flex h-80 items-center justify-center'>
                <ImageSlider images={product.images} />
              </div>
              <Card className='border-none'>
                <CardHeader className="pb-1">
                  <CardTitle>{product.title}</CardTitle>
                  <CardDescription className='flex items-center gap-2 pb-1'>
                    <Badge variant='outline' className='rounded-sm'>
                      {product.subtitle}
                    </Badge>
                    <Badge variant='outline' className='rounded-sm'>
                      {pctOff}% off
                    </Badge>
                  </CardDescription>
                </CardHeader>
                <CardContent className='pb-2'>
                  <p>
                    Exclusive deal direct from seller. Save ₹{saving} compared to MRP.
                  </p>
                </CardContent>
                <CardFooter className='justify-between gap-3 max-sm:flex-col max-sm:items-stretch '>
                  <div className='flex flex-col'>
                    <span className='text-sm font-medium uppercase'>Price</span>
                    <span className='text-xl font-semibold'>₹{product.ourPrice}</span>
                  </div>
                  <a
                    href={`https://wa.me/919898194074?text=${encodeURIComponent(product.whatsappText)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="no-underline"
                  >
                    <Button size='lg' className="bg-[#22c55e] hover:bg-[#16a34a] text-white border-0 shadow-lg shadow-green-500/20 gap-2.5">
                      {WA_ICON}
                      Order on WhatsApp
                    </Button>
                  </a>
                </CardFooter>
              </Card>
            </div>
          );
        })}

        {/* ── Store Section ── */}
        <Card className="border-border overflow-hidden">
          <div className="px-5 py-3 border-b border-border flex items-center justify-between flex-wrap gap-2">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">How to Order</p>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-xs text-[#22c55e]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" /> WhatsApp
              </span>
              <span className="text-xs text-muted-foreground">or</span>
              <span className="flex items-center gap-1.5 text-xs text-primary">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Visit Store
              </span>
            </div>
          </div>

          <CardContent className="pt-5 space-y-4">
            {/* Store info */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-lg flex-shrink-0">
                🏪
              </div>
              <div>
                <p className="font-semibold text-foreground text-base">MS Electrical- Bhestan, Surat</p>
                <p className="text-xs text-muted-foreground mt-0.5">Visit us in-store to see the product before buying</p>
              </div>
            </div>

            {/* Leaflet Map */}
            <div className="rounded-xl overflow-hidden border border-border h-56 shadow-sm">
              <MapContainer
                center={STORE_POSITION}
                zoom={17}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom={false}
                zoomControl={true}
                attributionControl={false}
              >
                {/* CartoDB Voyager — closest free tile to Google Maps style */}
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                  maxZoom={20}
                />
                <Marker position={STORE_POSITION} icon={googlePin}>
                  <Popup closeButton={false} className="google-popup">
                    <div style={{ fontFamily: "Plus Jakarta Sans, sans-serif", minWidth: 160 }}>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#1a1a1a" }}>MS Electrical</p>
                      <p style={{ margin: "2px 0 0", fontSize: 12, color: "#555" }}>Bhestan, Surat, Gujarat</p>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>

            {/* Directions button */}
            <a
              href="https://share.google/jBIWkKOmJXZ3pCPdB"
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline block"
            >
              <Button variant="outline" className="w-full gap-2 border-primary/30 text-primary hover:bg-primary/10 hover:text-primary hover:border-primary/60">
                <MapPin className="w-4 h-4" />
                Get Directions to MS Electrical
              </Button>
            </a>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground pb-4">
          Made with <span className="text-destructive">❤️</span> by <span className="font-semibold text-foreground">Siraj</span>
        </p>

      </div>
      <Analytics />
    </div>
  );
}
