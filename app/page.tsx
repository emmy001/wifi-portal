"use client";

import { useState, useEffect } from "react";
import FiberStartCard from "../src/Components/FiberStartCard";
import PackageSelectionModal from "../src/Components/PackageSelectionModal";
import { SimpleGrid, Box } from "@chakra-ui/react";
import PayHero from 'payhero-wrapper';
import axios from 'axios';

interface Package {
  id: number;
  name: string;
  description: string;
  price: number;
}

export default function Home() {
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [payHero, setPayHero] = useState<PayHero | null>(null);

  const packages: Package[] = [
    { id: 1, name: "Kinde Wifi", description: "40-minute Unlimited Access", price: 10 },
    { id: 2, name: "Net Mbao", description: "2-Hour Unlimited Access", price: 20 },
    { id: 3, name: "8 Hours Connection", description: "8-Hour Unlimited Access", price: 50 },
    { id: 4, name: "Daily Wifi", description: "24-Hour Unlimited Access", price: 100 },
    { id: 5, name: "Weekly Wifi", description: "7-Day Unlimited Access", price: 380 },
    { id: 6, name: "Monthly Wifi", description: "30-Day Unlimited Access", price: 1000 },
    { id: 7, name: "Quarterly Wifi", description: "90-Day Unlimited Access", price: 3500 },
  ];

  useEffect(() => {
    // Define your username and password
    const username = "KGNHc7cSnDcDul6ePCVZ"; // replace with your actual username
    const password = "f5q4ZoYvxFPpJ4V8e4SFqCknyiJfKsX2oUbt5tRF"; // replace with your actual password

    // Encode credentials in Base64
    const encodedCredentials = btoa(`${username}:${password}`);

    // Initialize PayHero with the encoded credentials
    const payHeroInstance = new PayHero(`Basic ${encodedCredentials}`);
    setPayHero(payHeroInstance);
    console.log("PayHero initialized with username and password");
  }, []);

  const handlePackageSelect = (pkg: Package) => {
    setSelectedPackage(pkg);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async () => {
    const phoneRegex = /^(?:\+254|0)\d{9}$/;

    // Validate inputs
    if (!phoneNumber || !selectedPackage || !payHero || !phoneRegex.test(phoneNumber)) {
      alert("Please provide a valid phone number (e.g., 0769998444 or +254769998444), select a package, and ensure PayHero is initialized.");
      console.warn("Validation failed:", {
        phoneNumber,
        selectedPackage,
        payHeroInitialized: !!payHero,
      });
      return;
    }

    setIsLoading(true);
    console.log("Preparing payment details:", {
      amount: selectedPackage.price,
      phone_number: phoneNumber,
      channel_id: 676,
      provider: "m-pesa",
      external_reference: "INV-009",
      callback_url: "http://localhost/api/callback",
    });

    const paymentDetails = {
      amount: selectedPackage.price,
      phone_number: phoneNumber,
      channel_id: 676,
      provider: "m-pesa",
      external_reference: "INV-009",
      callback_url: "http://localhost/api/callback",
    };

    try {
      const response = await payHero.makeStkPush(paymentDetails);
      console.log("Payment response received:", response); // Log the full response

      if (response.success) {
        alert("Payment successful!");
        console.log("Payment success details:", response);
      } else {
        alert("Payment failed: " + response.message);
        console.error("Payment failed with response:", response);
      }
    } catch (error) {
      console.error("Payment initiation error:", error); // Log the error details
      if (axios.isAxiosError(error)) {
        console.error("Axios error details:", error.response ? error.response.data : error.message);
      } else {
        console.error("General error:", error);
      }
      alert("An error occurred while processing the payment.");
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
      console.log("Loading state reset and modal closed.");
    }
  };

  return (
    <Box p={4} minH="100vh" textAlign="center">
      <h1>Select a Package</h1>

      <SimpleGrid columns={{ base: 2, md: 4 }} spacingX={8} spacingY={6} justifyItems="center" my={4}>
        {packages.map((pkg) => (
          <FiberStartCard
            key={pkg.id}
            name={pkg.name}
            description={pkg.description}
            price={pkg.price}
            onSelect={() => handlePackageSelect(pkg)}
          />
        ))}
      </SimpleGrid>

      <PackageSelectionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        selectedPackage={selectedPackage}
        phoneNumber={phoneNumber}
        onPhoneNumberChange={(e) => setPhoneNumber(e.target.value)}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </Box>
  );
}
