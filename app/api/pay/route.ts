import { NextResponse, NextRequest } from 'next/server';
import axios from 'axios';
import { Buffer } from 'buffer'; // Import Buffer correctly from Node.js
//import 'dotenv/config'; // Ensure dotenv is loaded only once in the right place

// Load environment variables
const consumerKey = process.env.CONSUMER_KEY!;
const consumerSecret = process.env.CONSUMER_SECRET!;
const mpesaShortCode = process.env.MPESA_SHORTCODE!;
const mpesaPassKey = process.env.MPESA_PASSKEY!;
const callbackURL = process.env.CALLBACK_URL!;

// Function to generate M-Pesa access token
const generateAccessToken = async (): Promise<string> => {
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
  console.log('Encode Auth:', auth); // Log encoded value

  try {
    const response = await axios.get(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );
    return response.data.access_token;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error generating access token:', error.response?.data); // Log the full error response
    } else {
      console.error('Error generating access token:', error);
    }
    throw new Error('Error generating access token');
  }
};

// Function to initiate STK push
const initiateSTKPush = async (phoneNumber: string, amount: number) => {
  const accessToken = await generateAccessToken();
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3); // YYYYMMDDHHMMSS format
  const password = Buffer.from(`${mpesaShortCode}${mpesaPassKey}${timestamp}`).toString('base64');

  const data = {
    BusinessShortCode: mpesaShortCode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline',
    Amount: amount,
    PartyA: phoneNumber,
    PartyB: mpesaShortCode,
    PhoneNumber: phoneNumber,
    CallBackURL: callbackURL,
    AccountReference: 'Service Access',
    TransactionDesc: 'Payment for service access',
  };

  try {
    const response = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      data,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error initiating STK Push:', error); // Log the error
    throw new Error('Error initiating STK Push');
  }
};

// The API route handler for Next.js
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { phoneNumber, package: selectedPackage } = body;

  // Validate phone number and package
  if (!phoneNumber || !selectedPackage) {
    return NextResponse.json({ message: "Phone number and package selection are required." }, { status: 400 });
  }

  try {
    // Initiate the M-Pesa STK push
    const result = await initiateSTKPush(phoneNumber, selectedPackage.price);

    return NextResponse.json({
      message: "STK Push initiated, check your phone.",
      result,
    }, { status: 200 });
  } catch (error) {
    console.error("Payment initiation error:", error);

    if (error instanceof Error) {
      return NextResponse.json({
        message: "An error occurred while processing the payment.",
        error: error.message,
      }, { status: 500 });
    } else {
      return NextResponse.json({
        message: "An unknown error occurred.",
        error: String(error), // Convert unknown error to a string
      }, { status: 500 });
    }
  }
}
