"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function EditPropertyPage() {
  const params = useParams();
  const router = useRouter();

  const propertyId = params.id as string;

  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [price, setPrice] = useState("");
  const [priceNumber, setPriceNumber] = useState("");
  const [beds, setBeds] = useState("");
  const [baths, setBaths] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [status, setStatus] = useState("For Sale");

  const [sqft, setSqft] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [yearBuilt, setYearBuilt] = useState("");
  const [garage, setGarage] = useState("");
  const [lotSize, setLotSize] = useState("");
  const [taxes, setTaxes] = useState("");
  const [schoolDistrict, setSchoolDistrict] = useState("");

  useEffect(() => {
    loadProperty();
  }, []);

  async function loadProperty() {
    const { data } = await supabase
      .from("properties")
      .select("*")
      .eq("id", propertyId)
      .single();

    if (!data) return;

    setTitle(data.title || "");
    setCity(data.city || "");
    setAddress(data.address || "");
    setZipCode(data.zip_code || "");
    setPrice(data.price || "");
    setPriceNumber(data.price_number?.toString() || "");
    setBeds(data.beds?.toString() || "");
    setBaths(data.baths?.toString() || "");
    setDescription(data.description || "");
    setImage(data.image || "");
    setStatus(data.status || "For Sale");

    setSqft(data.sqft?.toString() || "");
    setPropertyType(data.property_type || "");
    setYearBuilt(data.year_built?.toString() || "");
    setGarage(data.garage || "");
    setLotSize(data.lot_size || "");
    setTaxes(data.taxes || "");
    setSchoolDistrict(data.school_district || "");

    setLoading(false);
  }

  async function handleImageUpload(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("property-images")
      .upload(fileName, file);

    if (error) {
      alert("Upload failed");
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage
      .from("property-images")
      .getPublicUrl(fileName);

    setImage(publicUrl);
  }

  async function handleUpdateProperty() {
    await supabase
      .from("properties")
      .update({
        title,
        city,
        address,
        zip_code: zipCode,
        price,
        price_number: Number(priceNumber),
        beds: Number(beds),
        baths: Number(baths),
        description,
        image,
        status,

        sqft: sqft ? Number(sqft) : null,
        property_type: propertyType,
        year_built: yearBuilt ? Number(yearBuilt) : null,
        garage,
        lot_size: lotSize,
        taxes,
        school_district: schoolDistrict,
      })
      .eq("id", propertyId);

    router.push("/admin/properties");
    router.refresh();
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F8F5EF] px-6 py-12">
        <p>Loading property...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F5EF] px-6 py-12 text-[#1A1A1A]">
      <section className="mx-auto max-w-4xl">
        <p className="font-serif text-sm tracking-[0.35em] text-[#B19A55]">
          ADMIN
        </p>

        <h1 className="mt-4 font-serif text-5xl font-bold">
          Edit Property
        </h1>

        <div className="mt-10 grid gap-6 bg-white p-8 shadow-xl">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Property Title"
            className="border border-[#1A1A1A]/10 p-4"
          />

          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City"
            className="border border-[#1A1A1A]/10 p-4"
          />

          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Address"
            className="border border-[#1A1A1A]/10 p-4"
          />

          <input
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            placeholder="Zip Code"
            className="border border-[#1A1A1A]/10 p-4"
          />

          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Display Price"
            className="border border-[#1A1A1A]/10 p-4"
          />

          <input
            value={priceNumber}
            onChange={(e) => setPriceNumber(e.target.value)}
            placeholder="Numeric Price"
            className="border border-[#1A1A1A]/10 p-4"
          />

          <div className="grid gap-6 md:grid-cols-2">
            <input
              value={beds}
              onChange={(e) => setBeds(e.target.value)}
              placeholder="Beds"
              className="border border-[#1A1A1A]/10 p-4"
            />

            <input
              value={baths}
              onChange={(e) => setBaths(e.target.value)}
              placeholder="Baths"
              className="border border-[#1A1A1A]/10 p-4"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <input
              value={sqft}
              onChange={(e) => setSqft(e.target.value)}
              placeholder="Square Feet"
              className="border border-[#1A1A1A]/10 p-4"
            />

            <input
              value={yearBuilt}
              onChange={(e) => setYearBuilt(e.target.value)}
              placeholder="Year Built"
              className="border border-[#1A1A1A]/10 p-4"
            />
          </div>

          <input
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            placeholder="Property Type"
            className="border border-[#1A1A1A]/10 p-4"
          />

          <div className="grid gap-6 md:grid-cols-2">
            <input
              value={garage}
              onChange={(e) => setGarage(e.target.value)}
              placeholder="Garage"
              className="border border-[#1A1A1A]/10 p-4"
            />

            <input
              value={lotSize}
              onChange={(e) => setLotSize(e.target.value)}
              placeholder="Lot Size"
              className="border border-[#1A1A1A]/10 p-4"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <input
              value={taxes}
              onChange={(e) => setTaxes(e.target.value)}
              placeholder="Taxes"
              className="border border-[#1A1A1A]/10 p-4"
            />

            <input
              value={schoolDistrict}
              onChange={(e) => setSchoolDistrict(e.target.value)}
              placeholder="School District"
              className="border border-[#1A1A1A]/10 p-4"
            />
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border border-[#1A1A1A]/10 p-4"
          >
            <option>For Sale</option>
            <option>Pending</option>
            <option>Sold</option>
            <option>Featured</option>
          </select>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Property Description"
            rows={6}
            className="border border-[#1A1A1A]/10 p-4"
          />

          <div>
            <p className="mb-3 text-sm uppercase tracking-[0.2em] text-[#1A1A1A]/60">
              Main Property Image
            </p>

            <input type="file" onChange={handleImageUpload} />

            {image && (
              <img
                src={image}
                alt="Property"
                className="mt-4 h-56 w-full object-cover"
              />
            )}
          </div>

          <button
            onClick={handleUpdateProperty}
            className="bg-[#B19A55] px-8 py-4 font-serif text-sm font-bold uppercase tracking-[0.2em] text-white"
          >
            Update Property
          </button>
        </div>
      </section>
    </main>
  );
}