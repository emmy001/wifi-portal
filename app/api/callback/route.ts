// app/api/mpesa-callback/route.ts
import { NextResponse } from 'next/server';

interface CallbackMetadataItem {
  Name: string;
  Value: string | number;
}

interface StkCallback {
  ResultCode: number;
  CallbackMetadata: {
    Item: CallbackMetadataItem[];
  };
}

interface MpesaBody {
  Body: {
    stkCallback: StkCallback;
  };
}

export async function POST(request: Request) {
  const { Body }: MpesaBody = await request.json();
  const callbackData = Body.stkCallback;

  if (callbackData.ResultCode === 0) {
    // Payment successful
    const amount = callbackData.CallbackMetadata.Item.find(item => item.Name === 'Amount')?.Value;
    const phoneNumber = callbackData.CallbackMetadata.Item.find(item => item.Name === 'PhoneNumber')?.Value;

    if (amount && phoneNumber) {
      // Log success and grant access (e.g., update database or session)
      console.log(`Payment of KES ${amount} from ${phoneNumber} was successful.`);
      return NextResponse.json({ message: 'Payment successful' }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Required data missing in CallbackMetadata' }, { status: 400 });
    }
  } else {
    // Payment failed
    console.log('Payment failed:', callbackData);
    return NextResponse.json({ message: 'Payment failed', callbackData }, { status: 400 });
  }
}
