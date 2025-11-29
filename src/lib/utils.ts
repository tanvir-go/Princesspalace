import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { type Price } from "./menu-data";
import { type PartyBooking } from "@/components/forms/PartyBookingForm";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: Price): string {
  if (typeof price === 'number') {
    if (price === 0) return 'Custom';
    return `৳${price.toFixed(0)}`;
  }
  
  const priceEntries = Object.entries(price);
  if (priceEntries.length === 0) return '';
  
  // For multiple prices, show the starting price or a range
  const prices = Object.values(price).sort((a,b) => a - b);
  if (prices.length > 1) {
    return `from ৳${prices[0]}`
  }
  
  return priceEntries.map(([key, value]) => `${key}: ৳${value}`).join(' / ');
}

export function format(date: Date, s: string) {
    return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
}

export function printPartyBookingInvoice(booking: PartyBooking) {
    const printContent = `
        <div style="font-family: Arial, sans-serif; width: 800px; margin: auto; padding: 20px; border: 1px solid #ccc;">
            <div style="text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px;">
                <h1 style="font-size: 2.5rem; margin: 0;">Princesspalace</h1>
                <p style="font-size: 1rem; margin: 5px 0;">Party Center Booking Invoice</p>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
                <div>
                    <h3 style="margin: 0 0 10px;">Bill To:</h3>
                    <p style="margin: 0;">${booking.name}</p>
                    <p style="margin: 0;">${booking.phone}</p>
                </div>
                <div>
                    <p style="margin: 0;"><strong>Invoice #:</strong> ${booking.id}</p>
                    <p style="margin: 0;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                </div>
            </div>
            <h3 style="border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 10px;">Booking Details</h3>
            <table style="width: 100%; margin-bottom: 20px;">
                <tbody>
                    <tr>
                        <td style="padding: 5px;"><strong>Event Type:</strong></td>
                        <td style="padding: 5px;">${booking.eventType}</td>
                    </tr>
                    <tr>
                        <td style="padding: 5px;"><strong>Event Date:</strong></td>
                        <td style="padding: 5px;">${new Date(booking.date).toLocaleDateString()}</td>
                    </tr>
                    <tr>
                        <td style="padding: 5px;"><strong>Number of Guests:</strong></td>
                        <td style="padding: 5px;">${booking.guestCount}</td>
                    </tr>
                    ${booking.requests ? `
                    <tr>
                        <td style="padding: 5px; vertical-align: top;"><strong>Special Requests:</strong></td>
                        <td style="padding: 5px;">${booking.requests}</td>
                    </tr>
                    ` : ''}
                </tbody>
            </table>

            <h3 style="border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 10px;">Payment Summary</h3>
            <table style="width: 50%; margin-left: auto; border-collapse: collapse;">
                <tbody>
                    <tr>
                        <td style="padding: 8px; text-align: right;">Total Amount:</td>
                        <td style="padding: 8px; text-align: right;">৳${booking.total.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; text-align: right;">Discount:</td>
                        <td style="padding: 8px; text-align: right;">- ৳${booking.discount.toFixed(2)}</td>
                    </tr>
                     <tr>
                        <td style="padding: 8px; text-align: right; border-bottom: 1px solid #ccc;">Advance Paid:</td>
                        <td style="padding: 8px; text-align: right; border-bottom: 1px solid #ccc;">- ৳${booking.advance.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; text-align: right; font-weight: bold;">Due Amount:</td>
                        <td style="padding: 8px; text-align: right; font-weight: bold;">৳${booking.due.toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>
             <div style="margin-top: 50px; text-align: center; font-size: 0.8rem; color: #555;">
                <p>Thank you for choosing Princesspalace for your event!</p>
                <p>For any queries, please contact us at +880123456789</p>
            </div>
        </div>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
        printWindow.document.write('<html><head><title>Party Booking Invoice</title></head><body>');
        printWindow.document.write(printContent);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
        printWindow.close();
    }
}
