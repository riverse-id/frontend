# River Status Map — Panduan Integrasi

Source code ini menampilkan sungai sebagai **garis (polyline/GeoJSON)** dengan warna
berdasarkan status, menggantikan pendekatan titik tunggal untuk sungai.

## Aturan warna

| Status      | Warna   | Kode      | Arti                                   |
|-------------|---------|-----------|-----------------------------------------|
| `default`   | Hijau   | `#22c55e` | Segmen belum pernah dilaporkan          |
| `tercemar`  | Merah   | `#ef4444` | Laporan limbah cair / bau / bahaya      |
| `sampah`    | Oranye  | `#f97316` | Laporan sampah plastik menumpuk         |

Marker titik laporan (pending/terverifikasi/diproses/selesai) tetap dipertahankan
di atas garis sungai, dengan warna sesuai legenda lama di aplikasimu.

## File yang disertakan

- `RiverStatusMap.jsx` — komponen React pakai `react-leaflet`
- `rivers-dummy.geojson` — 7 segmen sungai dummy (Ciliwung, Cipinang, Kalimalang,
  Pesanggrahan) di area Jakarta, tiap segmen punya properti `status`

## Instalasi dependency (kalau belum ada)

```bash
npm install react-leaflet leaflet
```

Jangan lupa import CSS Leaflet sekali di entry point app kamu:

```js
import "leaflet/dist/leaflet.css";
```

## Cara pakai

```jsx
import RiverStatusMap, { RiverMapLegend } from "./RiverStatusMap";

function PetaSungaiPage() {
  return (
    <div style={{ position: "relative", height: 600 }}>
      <RiverStatusMap
        geojsonUrl="/api/rivers"  // ganti ke endpoint backend kamu
        activeFilter="semua"
        onSelectRiverSegment={(feature) => {
          console.log("Segmen diklik:", feature.properties);
        }}
        onSelectReport={(report) => {
          console.log("Laporan diklik:", report);
        }}
      />
      <div style={{ position: "absolute", bottom: 16, left: 16, zIndex: 1000 }}>
        <RiverMapLegend />
      </div>
    </div>
  );
}
```

## Menyesuaikan ke struktur data backend kamu

1. **Format data sungai**: harus GeoJSON `FeatureCollection` dengan geometry
   `LineString` (atau `MultiLineString` untuk sungai bercabang). Tiap `Feature`
   wajib punya `properties.status` bernilai `"default"`, `"tercemar"`, atau
   `"sampah"`. Kalau field status di database kamu namanya beda (misal
   `tingkat_pencemaran`), cukup sesuaikan mapping di `getRiverStyle()`.

2. **Logika penentuan status otomatis** (opsional, di backend):
   - Kalau ada laporan `terverifikasi` bertipe "Limbah Cair" atau "Bau Air"
     dalam radius X meter dari segmen → set `status: "tercemar"`
   - Kalau ada beberapa laporan `terverifikasi`/`diproses` bertipe "Sampah
     Plastik" → set `status: "sampah"`
   - Kalau tidak ada laporan aktif → `status: "default"`
   - Ini bisa dihitung pakai PostGIS `ST_DWithin` untuk mencocokkan titik
     laporan dengan segmen garis sungai terdekat (radius deteksi ~500m sesuai
     yang sudah kamu pakai untuk duplikasi spasial).

3. **Data koordinat sungai asli**: kalau kamu punya data resmi (misal dari
   BIG/Kementerian PUPR, OpenStreetMap Overpass API, atau data internal DLH),
   ganti isi `rivers-dummy.geojson` dengan itu. Format GeoJSON `LineString`
   tetap sama, tinggal isi koordinat aslinya.

## Catatan

- Warna, radius, dan style bisa diubah semua di objek `RIVER_STATUS_STYLE`
  dan `REPORT_STATUS_COLOR` di bagian atas `RiverStatusMap.jsx`.
- Popup otomatis muncul saat garis sungai diklik, menampilkan nama sungai,
  status, dan keterangan.
- Hover pada garis akan mempertebal garis sementara (efek highlight).
