exports.generateBookingConfirmEmail = ({ bookingId, firstName, lastName, email, phone, combinedData, returnservice, paymentdetails, bookActionType, billingDetails, message, account_number }) => {

    const { pickUpDate, pickUpTime } = combinedData;
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = ("0" + date.getDate()).slice(-2);
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        const year = date.getFullYear();
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayOfWeek = daysOfWeek[date.getDay()];
        return `${month}-${day}-${year} - ${dayOfWeek}`; 
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        const minutesFormatted = ("0" + minutes).slice(-2);
        return `${hours}:${minutesFormatted} ${ampm}`; // '6:30 PM'
    };

    const formattedDate = formatDate(pickUpDate);
    const formattedTime = formatTime(pickUpDate);
    const formattedDropOffTime = formatTime(combinedData?.estimatedDropOffTime);

    const capitalizeName = (name) => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    let emailContent = `
    <html>  
        <body>
        <div style="font-size: 12px; font-family: Arial, sans-serif;">
            <div style="display: flex; background-color: #f0f0f0; justify-content:space-between; align-items: center; font-size: 12px; font-family: Arial, sans-serif;">
                <img src="cid:logo" alt="Logo" style="max-width: 100px; height: auto; padding-top:5px; padding-left:10px">
                <div style="padding-top:5px; padding-right:5px; line-height: 1;">
                    <p style="margin: 0; padding: 0; font-weight: bold;  color: #817f89">Executive Chauffeured</p>
                    <p style="margin: 0; padding: 0; font-weight: bold;  color: #817f89">Transportation Worldwide</p>
                </div>
            </div>
        <div style="font-size: 14px; line-height: 1.5;">
            <p style="margin: 0; font-size: 20px; font-weight: bold; line-height: 1.5; padding-top: 20px;">
                ${bookActionType === "Book Now" ? "Ride Confirmation" : "Ride Price Quote"}
            </p>
        </div>
             ${message ? `<p><strong>Message:</strong> ${message}</p><hr>` : ''}
           <p style="margin: 0; line-height: 1.5;margin-bottom: 15px;">
            ${bookActionType === "Book Now"
                ? "Please review your Reservation Details and Routing Instructions carefully, if any of the information appears to be incorrect, please contact our reservation department immediately via email reservations@bostonasapcoach.com or by phone toll-free US/Canada 800.960.0232. International +1.617.630.0232."
                : "Please review your Quote Details and Routing Instructions carefully, if any of the information appears to be incorrect, please contact our reservation department immediately via email reservations@bostonasapcoach.com or by phone toll-free US/Canada 800.960.0232. International +1.617.630.0232."
            }
            </p>
            <table style="background-color: #f0f0f0; border-collapse: collapse; width: 100%; font-size: 14px; color: #333;">
                <tr>
                    <td style="width: 25%; padding: 5px; background-color: #f0f0f0; border-radius: 5px; font-weight: bold;">
                        ${bookActionType === "Book Now" ? `Reservation Number:` : `Quote Number:`}
                    </td>
                    <td style=" background-color: #f0f0f0; border-radius: 5px; font-weight: bold;">
                        ${bookingId}
                    </td>
                </tr>
            </table>
         <!-- Reservation Details Table -->
         <table style="border-collapse: collapse; width: 100%; font-size: 12px; color: #333;">
                <tr>
                    <td style="width: 25%; "><strong>Reservation Date / Day:</strong></td>
                    <td>${formattedDate}</td>
                </tr>
                <tr>
                    <td  style="width: 25%;"><strong>Reservation Time:</strong></td>
                    <td>${formattedTime}</td>
                </tr>
                <tr>
                    <td  style="width: 25%;"><strong>Estimated Drop Time:</strong></td>
                    <td>${formattedDropOffTime}</td>
                </tr>
                <tr>
                    <td  style="width: 25%; "><strong>Passenger Name:</strong></td>
                    <td>${capitalizeName(firstName)} ${capitalizeName(lastName)}</td>
                </tr>
                <tr>
                    <td style="width: 25%; "><strong>Passenger Phone Number:</strong></td>
                    <td>${phone || 'N/A'}</td>
                </tr>
                <tr>
                    <td><strong>Passenger Email:</strong></td>
                    <td>${email || 'N/A'}</td>
                </tr>
                ${combinedData?.passengerDetails?.passengers?.length > 0 ? combinedData.passengerDetails.passengers.map((passenger) => `
                <tr>
                    <td  style="width: 25%;"><strong>Additional Passenger Name:</strong></td>
                    <td>${capitalizeName(passenger.firstname)} ${capitalizeName(passenger.lastname)}</td>
                </tr>
                <tr>
                    <td  style="width: 25%; "><strong>Additional Passenger Phone:</strong></td>
                    <td>${passenger?.phone ? `+${passenger.phone}` : 'N/A'}</td>
                </tr>
                ${passenger?.email ? `
                <tr>
                    <td  style="width: 25%; "><strong>Additional Passenger Email:</strong></td>
                    <td>${passenger.email}</td>
                </tr>` : ''}
                `).join('') : ''}
                <tr>
                    <td  style="width: 25%; "><strong>Number of Passenger(s):</strong></td>
                    <td>${combinedData?.passengers || 'N/A'}</td>
                </tr>
                <tr>
                    <td  style="width: 25%; "><strong>Number of Luggage(s):</strong></td>
                    <td>${combinedData?.luggage || 'N/A'}</td>
                </tr>
                <tr>
                    <td  style="width: 25%;"><strong>Type of Service:</strong></td>
                    <td>${combinedData?.serviceType || 'N/A'}</td>
                </tr>
                <tr>
                    <td  style="width: 25%;"><strong>Vehicle Class:</strong></td>
                    <td>${combinedData?.selectedVehicle?.name || 'N/A'}</td>
                </tr>
                <tr>
                    <td></td>
                    <td><hr style="border: 1.5px solidd #c7bfbf; width: 100%; margin-top: 10px;"></td>
                </tr>
            </table>
        <!-- Routing Details Table -->
        <h3 style="font-size: 12px; font-weight: bold; color: #444; margin-bottom: 10px; padding-bottom: 5px;">Routing Details</h3>
        <table style="border-collapse: collapse; width: 100%; font-size: 12px; color: #333;">
            <tr>
            <td style="width: 25%; vertical-align: top;"><strong>Pick-Up Location:</strong></td>
            <td>${combinedData?.pickupCoords?.address || 'N/A'}</td>
            </tr>
            ${combinedData.stops && combinedData.stops.length > 0 
                ? `<tr>
                    <td style="width: 25%; vertical-align: top;"><strong>Stop(s):</strong></td>
                    <td>${combinedData.stops.map((stop, index) => `Stop ${index + 1}: ${stop.address || 'N/A'}`).join(', ')}</td>
                </tr>` 
                : ''}
            <tr>
                <tr>
                    <td style="width: 25%; "><strong>Final Destination:</strong></td>
                    <td>${combinedData?.dropoffCoords?.address || 'N/A'}</td>
                </tr>
                <tr>
                    <td style="width: 25%;"><strong>Authorized Wait:</strong></td>
                    <td>${combinedData?.allowedWaitTime || 'N/A'}</td>
                </tr>
                ${combinedData?.passengerDetails?.otherCommentsData?.otherComments ? `
                <tr>
                    <td style="width: 25%;"><strong>Instructions:</strong></td>
                    <td>${combinedData.passengerDetails.otherCommentsData.otherComments}</td>
                </tr>
                ` : ''}
                <tr>
                    <td></td>
                    <td><hr style="border: 1.5px solidd #c7bfbf; width: 100%; margin-top: 10px;"></td>
                </tr>
            </table>
        </div>
    </body>
    </html>`;

    if (combinedData?.flightDetails?.pickupFlightDetails?.airline && combinedData?.flightDetails?.pickupFlightDetails?.flightNumber) {
        const pickupFlightDetails = combinedData.flightDetails.pickupFlightDetails;
        emailContent += `
        <div style="font-size: 12px; color: #333;">
            <h3 style="font-size: 12px; font-weight: bold; color: #444; margin-bottom: 10px; padding-bottom: 5px;">
            Pick-Up Flight Details:
            </h3>
            <table style="border-collapse: collapse; width: 100%; font-size: 12px; color: #333;">
                <tr>
                    <td style="width: 25%; padding: 5px;"><strong>Airline:</strong></td>
                    <td >${pickupFlightDetails.airline}</td>
                </tr>
                <tr>
                    <td><strong>Flight Number:</strong></td>
                    <td>${pickupFlightDetails.flightNumber}</td>
                </tr>
            </table>
        </div>
        `;
    }
    
    if (combinedData?.flightDetails?.dropoffFlightDetails?.airline && combinedData?.flightDetails?.dropoffFlightDetails?.flightNumber) {
        const dropoffFlightDetails = combinedData.flightDetails.dropoffFlightDetails;
        emailContent += `
        <div style="font-size: 12px; color: #333;">
            <h3 style="font-size: 12px; font-weight: bold; color: #444; margin-bottom: 10px; padding-bottom: 5px;">
            Drop-Off Flight Details:
            </h3>
             <table style="border-collapse: collapse; width: 100%; font-size: 12px; color: #333;">
                <tr>
                    <td style="width: 25%"><strong>Airline:</strong></td>
                    <td>${dropoffFlightDetails.airline}</td>
                </tr>
                <tr>
                    <td><strong>Flight Number:</strong></td>
                    <td>${dropoffFlightDetails.flightNumber}</td>
                </tr>
                <tr>
                    <td></td>
                    <td><hr style="border: 1.5px solidd #c7bfbf; width: 100%; margin-top: 10px;"></td>
                </tr>
            </table>
        </div>
        `;
    }
    
    if (combinedData.childSeats && combinedData.childSeats.length > 0) {
        emailContent += `
        <div style="font-size: 12px; color: #333;">
            <h3 style="font-size: 12px; font-weight: bold; color: #444; margin-bottom: 10px; padding-bottom: 5px;">
            Child Seats:
            </h3>
            <table style="border-collapse: collapse; width: 100%; font-size: 12px; color: #333;">
                ${combinedData.childSeats.map(seat => {
                    return `<tr>
                        <td style="width: 25%"><strong>Seat Type:</strong></td>
                        <td >${seat.type}</td>
                    </tr>
                    <tr>
                        <td ><strong>Quantity:</strong></td>
                        <td >${seat.quantity}</td>
                    </tr>`;
                }).join('')}
                <tr>
                    <td></td>
                    <td><hr style="border: 1.5px solidd #c7bfbf; width: 100%; margin-top: 10px;"></td>
                </tr>
            </table>
        </div>
        `;
    }
    
    if (paymentdetails && paymentdetails.cardNumber) {
        const maskedCardNumber = paymentdetails?.cardNumber
            ? `**** **** **** ${paymentdetails.cardNumber.slice(-4)}`
            : 'N/A';
        emailContent += `
        <div style="font-size: 12px; color: #333;">
            <h3 style="font-size: 12px; font-weight: bold; color: #444; margin-bottom: 10px; padding-bottom: 5px;">
                Billing / Payment:
            </h3>
           <table style="border-collapse: collapse; width: 100%; font-size: 12px; color: #333;">
            <tr>
                <td style="width: 25%;"><strong>Booking Contact Name:</strong></td>
                <td>${capitalizeName(firstName)} ${capitalizeName(lastName)}</td>
            </tr>
            <tr>
                <td><strong>Booking Contact Number:</strong></td>
                <td>${phone || 'N/A'}</td>
            </tr>
            <tr>
                <td><strong>Booking Contact Email:</strong></td>
                <td>${email || 'N/A'}</td>
            </tr>
            <tr>
                <td><strong>Reference Account Number:</strong></td>
                <td>${account_number}</td>
            </tr>
            <tr>
                <td><strong>Credit Card Number:</strong></td>
                <td>${maskedCardNumber}</td>
            </tr>         
            <tr>
                <td><strong>Credit Card Type:</strong></td>
                <td>${paymentdetails?.paymentMethod || 'N/A'}</td>
            </tr>
            <tr>
                <td><strong>Credit Card Expiration Date:</strong></td>
                <td>${paymentdetails?.expirationMonth}/ ${paymentdetails.expirationYear}</td>
            </tr>
            <tr>
                <td><strong>Credit Card Holder Name:</strong></td>
                <td>${paymentdetails?.cardholderName ? capitalizeName(paymentdetails.cardholderName) : 'N/A'}</td>
            </tr>
            <tr>
                <td><strong>Billing Address:</strong></td>
                <td>${paymentdetails?.address}, ${paymentdetails?.city} ${paymentdetails?.state}</td>
            </tr>
            <tr>
                <td></td>
                <td><hr style="border: 1.5px solidd #c7bfbf; width: 100%; margin-top: 10px;"></td>
            </tr>
        </table>
        </div>
        `;
    }
        emailContent += `
    
            <div style="font-size: 12px; color: #333;">
                <h3 style="font-size: 12px; font-weight: bold; color: #444; margin-bottom: 10px; padding-bottom: 5px;">
                Charges / Fees:
                </h3>
        <table style="border-collapse: collapse; width: 100%; font-size: 12px; color: #333;">
            <tr>
                <td style="width: 25%;"><strong>
                ${billingDetails.baseRateType === 'Base Flat Rate' ? 'Base Flat Rate' : 'Base Hourly Rate'}:</strong></td>
                <td style="text-align: right; width: 4%; padding-right: 10px">${billingDetails.flatBaseRate}</td>
                <td style="width: 12%; "><strong>Estimated Hours:</strong></td>
                <td style="width:20px;">${billingDetails.estHours}</td>
                <td style="width: 10%;"><strong>Base Rate Total:</strong></td>
                <td>${billingDetails.baseRateTotal}</td>
            </tr>
            <tr>
                <td><strong>Wait Time Total:</strong></td>
                <td style="text-align: right; padding-right: 10px">${billingDetails.waitTimeTotal}</td>
                <td><strong>Units:</strong></td>
                <td style="text-align: left;">${billingDetails.waitTimeUnit}</td>
                <td colspan="2"></td>
            </tr>
            <tr>
                <td><strong>En-Route Stop(s):</strong></td>
                <td style="text-align: right; padding-right: 10px">${billingDetails.extraStopsTotal}</td>
                <td><strong>Units:</strong></td>
                <td style="text-align: left;">${billingDetails.extraStopUnit}</td>
                <td colspan="2"></td>
            </tr>
            <tr>
                <td><strong>Service Charge:</strong></td>
                <td style="text-align: right; padding-right: 10px;">${billingDetails.serviceCharge}</td>
                <td colspan="4"></td>
            </tr>
            <tr>
                <td><strong>Subtotal:</strong></td>
                <td style="text-align: right; padding-right: 10px">${billingDetails.subTotal}</td>
                <td colspan="4"></td>
            </tr>
            <tr>
                <td><strong>Holiday Surcharge:</strong></td>
                <td style="text-align: right; padding-right: 10px">${billingDetails.holidaySurch}</td>
                <td colspan="4"></td>
            </tr>
            <tr>
                <td><strong>Late PM / Early AM Charge:</strong></td>
                <td style="text-align: right; padding-right: 10px">${billingDetails.earlyCharge}</td>
                <td colspan="4"></td>
            </tr>
            <tr>
                <td><strong>Meet & Greet Charges:</strong></td>
                <td style="text-align: right; padding-right: 10px">${billingDetails.meet_greet}</td>
                <td colspan="4"></td>
            </tr>
            <tr>
                <td><strong>Tolls / Parking:</strong></td>
                <td style="text-align: right; padding-right: 10px">${billingDetails.tolls}</td>
                <td colspan="4"></td>
            </tr>
            <tr>
                <td><strong>Airport Tax / Fees:</strong></td>
                <td style="text-align: right; padding-right: 10px">${billingDetails.airportTax}</td>
                <td colspan="4"></td>
            </tr>
            <tr>
                <td><strong>Administrative Fees:</strong></td>
                <td style="text-align: right; padding-right: 10px">${billingDetails.adminFee}</td>
                <td colspan="4"></td>
            </tr>
            <tr>
                <td><strong>STC Surcharge:</strong></td>
                <td style="text-align: right; padding-right: 10px;">${billingDetails.stcCharge}</td>
                <td colspan="4"></td>
            </tr>
            <tr>
                <td><strong>Child Seat(s):</strong></td>
                <td style="text-align: right; padding-right: 10px">${billingDetails.childSeatTotal}</td>
                <td><strong>Qty:</strong></td>
                <td>${billingDetails.childSeatUnit}</td>
                <td colspan="2"></td>
            </tr>
            <tr>
                <td><strong>Miscellaneous:</strong></td>
                <td style="text-align: right; padding-right: 10px">${billingDetails.miscellaneous}</td>
                <td colspan="4">${billingDetails.miscellType}</td>
            </tr>
            <tr>
                <td><strong>Discount:</strong></td>
                <td style="text-align: right; padding-right: 10px">${billingDetails.discount}</td>
                <td style="text-align: left;">${billingDetails.discountPercent}${billingDetails. discountType}</td>
                <td style="text-align: left;"></td>
                <td colspan="2"></td>
            </tr>
            <tr>
                <td><strong>State Tax / GST / VAT:</strong></td>
                <td style="text-align: right; padding-right: 10px">${billingDetails.stateTax}</td>
                <td colspan="4"></td>
            </tr>
            <tr>
                <td><strong>Estimated Total:</strong></td>
                <td style="text-align: right; padding-right: 10px">${billingDetails.estimatedTotal}</td>
                <td style="text-align: left;">${billingDetails.currency}</td>
                <td colspan="2"></td>
            </tr>
            <tr>
                <td><strong>Payments / Deposits:</strong></td>
                <td style="text-align: right; padding-right: 10px">${billingDetails.payment}</td>
                <td style="text-align: left;">${billingDetails.currency}</td>
                <td colspan="2"></td>
            </tr>
            <tr>
                <td><strong>Total Amount Due:</strong></td>
                <td style="text-align: right; padding-right: 10px">${billingDetails.totalDue}</td>
                <td style="text-align: left;">${billingDetails.currency}</td>
                <td colspan="2"></td>
            </tr>
        </table>

            </div>
        `;

        
    emailContent += `
        <div style="font-size: small;">
            <hr>
                <p style="font-size: 12px; font-weight: bold; color: #444; margin-bottom: 10px; padding-bottom: 5px;">THINGS TO KNOW</p>
               ${bookActionType === "Book Now" ? `
                <p>
                Estimated total amount shown may fluctuate depending on Waiting-Time, En-Route Stop(s), Ride Duration, Tolls/Parking, Government mandated charges, etc. 
                Time-based Hourly Rates will be billed from the time of Pick-up to the time of Drop-off plus Garage-to-Garage charges. All rates are estimated and are subject to change due to additional charges.
                Such charges will appear without notice among your final charges as applicable. For any last-minute Changes or Cancellations, please review our policies below carefully to avoid any preventable Charges.</p>
                <h3 style="font-size: 13px; font-weight: bold; color: #444; margin-bottom: 10px; padding-bottom: 5px;">Change, Cancellation, and No-Show Policy</h3>
                <p>Late change, cancellation, and no-show policy applies to all confirmed flat rate and time-based hourly rate reservations:→</p>
                <ul>
                    <li>For flat rate transfer reservations in the United States, Canada, and Puerto Rico, a late change fee or late cancellation fee for all transfer reservations will be charged. Unless the Transfer reservations changed or cancelled within the minimum stated time prior to the scheduled pick-up time.</li>
                    <li>For time-based hourly reservations, a late change fee or late cancellation fee equal to the minimum hours quoted at the time of reservation will be charged. Unless the hourly reservation changed or cancelled within the minimum stated time prior to the scheduled pick-up time.</li>
                    <li>For all countries not aforementioned and where a reservation is changed or cancelled within the minimum stated time prior to the scheduled pick-up time, either transfer reservation or time-based hourly rate reservation will incur a fee equal to the applicable transfer rate or hourly rate plus local VAT where applicable will be charged.
                    Unless the transfer or hourly reservation changed or cancelled within the minimum stated time prior to the scheduled pick-up time.</li>
                    <li>Applies to all reservations where the pickup location is within the local city metropolitan area. The local city metropolitan area is defined as within 50 miles of the city center. All services outside the local city metropolitan area may be assessed the actual drive time to and from the pick-up location.</li>
                    <li>All Special Event reservations change and cancellation policies supersede standard change and cancellation policies and are noted in the email confirmation.</li>
                    <li>A No-Show fee equal to the transfer or time-based hourly minimum rate, plus any if applicable wait time, applicable tolls, parking, airport fee, fuel surcharge, STC charge, regulatory fees, taxes,
                    will apply for all confirmed reservations, should the passenger fail to cancel or meet the chauffeur at the designated pick-up location.</li>
                </ul>
                <p>
                    To avoid a late change / modification fee, cancellation fee, or no-show fee, the reservation(s) must be changed or cancelled in accordance with the cancellation policy terms noted below			
                    in this email confirmation. You may either change, modify or cancel the reservation on-line, via email reservations@bostonasapcoach.com or by phone toll-free US/Canada 800.960.0232.			
                    International +1.617.630.0232. Please note if reservation(s) is within Six Hours, please Call to change / modify or cancel.
                </p>
                <h3 style="font-size: 13px; font-weight: bold; color: #444; margin-bottom: 10px; padding-bottom: 5px;">Change and Cancellation Terms</h3>
                <ul>
                    <li>Sedan Reservations are changed or cancelled more than Three (3) Hours prior to the scheduled pickup time.</li>
                        <li>SUV / MPV Reservations are changed or cancelled more than Six (6) Hours prior to the scheduled pickup time.</li>
                        <li>Van / Sprinter Reservations are changed or cancelled more than Twelve (12) Hours prior to the scheduled pickup time.</li>
                        <li>Sedan Limousine / SUV Limousine / Sprinter Limo Coach Reservations are changed or cancelled more than Seventy-Two (72) Hours prior to the scheduled pickup time.</li>
                        <li>Limo Coach / Mini Coach / Motor Coach Reservations are changed or cancelled more than Seventy-Two (72) Hours prior to the scheduled pickup time.</li>
                        <li>Event and Special Occasion Reservations are changed or cancelled more than Seventy-Two (72) Hours prior to scheduled pickup time.</li>
                        <li>International Reservations for Sedan, SUV, MPV, and Van are changed or cancelled more than Twenty-Four (24) Hours prior to the scheduled pickup time.</li>
                </ul>
                <p>
                	The above cancellation terms represent standard policy at the Company and may be modified from time to time based on market, desired reservation dates and vehicle availability.			
	                All modifications that are mutually agreed upon in writing or communicated and confirmed at the time of reservation will supersede the above.
                </p>
                <h3 style="font-size: 13px; font-weight: bold; color: #444; margin-bottom: 10px;  padding-bottom: 5px;">Wait Time Policy</h3>
                <p>All flat-rate rides that do not begin at an airport are subject to Wait Time after the Ten (10) minutes of grace period is over: →</p>
                <ul>
                    <li>On all flat rate transfers origination from an Airport, customers are permitted waiting period of Forty Five (45) minutes after the actual arrival time of domestic flights and Seventy (70) minutes for international flights at no extra charge.</li>
                </ul>
                <h3 style="font-size: 13px; font-weight: bold; color: #444; margin-bottom: 10px;  padding-bottom: 5px;">Additional</h3>
                <ul>
                   <li>The Company assumes no liability for any lost or misplaced personal property or any other items left in the vehicle.</li>
                   <li>The party hiring the vehicle acknowledges and agrees the terms of this reservation liability agreement and also understand that the said party his/her responsibility in returning the vehicle to the Company in the same condition as when received. Otherwise in addition to the Flat or Time-based Hourly Rate for Vehicle and Chauffeur, 
                   any damage excess of usual use and wear of Hired Vehicle, there will be a minimum charge of 400.00 USD for the Repair and or General Cleaning of the Vehicle.</li>
                   <li>Additionally, in no event, will the Company or any of its affiliates or subcontractors be liable or responsible for damages of any kind caused by any delay in performance or failure to perform, in whole or in part, 
                   any of their obligations in connection with the services, where such delay or failure is due in part to traffic, road construction, strikes, weather, fire, flood, earthquake, act of God, act of war or terrorism, act of any public authority or sovereign government, civil disorder, 
                   government sanctioned embargo, delay caused by any air or ground passenger carrier, or any other circumstances beyond the reasonable control of the Company, its affiliates, or subcontractors.</li>
                </ul>
                </div>
                 <h3 style="font-size: 13px; font-weight: bold; color: #444; margin-bottom: 10px;  padding-bottom: 5px;">Questions about this reservation? </h3>
                 <p>Check out our FAQs: https://www.bostonasapcoach.com/supports-faqs/ or Call 24/7 Reservations: 800.960.0232 If calling from outside the US or Canada, please dial: +1.617.630.0232 </p>
                <p>
                <strong>Have you booked the second leg of your travel yet?</strong>
                <button style="background-color: #f0f0f0; color: #333; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">
                    Book a Ride
                </button>
                </p>
                 ` : `
                 <p>
                   <ul>
                   <li>  All Quotes are valid for 30 days. Reservation must be booked within 30 days. Trip can take place after 30 days.</li>
                   <li>  Rate Quoted prior to service are only an initial estimate of the cost of services reserved, and are subject to change due to additional charges such as waiting time, on-route stop, tolls, parking, airport tax/fees and government taxes. </li>
                   <li>  Such charges will appear without notice among your quoted amount if applicable. Actual total amount due will be calculated upon completion of the service.</li>
                   </ul>
                </p>
                <p>
                If you require immediate assistance or need to book a ride, please contact us via email reservations@bostonasapcoach.com or by phone US/Canada 800.960.0232.
                International +1.617.630.0232
                </p>
            <p style="font-size: 13px; font-weight: bold; color: #444; margin-bottom: 10px; padding-bottom: 5px;">Questions about this Quote?</p>
            <p>Check out our FAQs: <a href="https://www.bostonasapcoach.com/supports-faqs/">FAQs</a> or Call Reservations Department 24/7</p>
        `}
                
                <p style="text-align: center; font-weight: bold; font-style: italic; font-size: small;">Thank you for using our Chauffeured Transportation Services</p>
                <p style="text-align: center; font-weight: bold; font-style: italic; font-size: small;">We look forward to serving you soon</p>
        
            <div style="color: red; font-size: 12px; font-family: 'Courier New', Courier, monospace;">
            <p>CONFIDENTIALITY NOTICE:</p>
            <p>
            This e-mail transmission and any attachments that accompany it may contain information that is privileged, confidential, or otherwise exempt from disclosure under applicable law and is intended
            distribution, copying or other use or retention of this communication or its substance is prohibited. If you have received this communication in error, please immediately reply to the author via e-mail
            solely for the use of the individual(s) to whom it was intended to be addressed. If you have received this e-mail by mistake, or you are not the intended recipient, any disclosure dissemination,
            that you received this message by mistake and permanently delete the original and all copies of this e-mail and any attachments from your computer.
            </p>
            <p>
            Thank you.
            </p>
            </div>
        </body>
        </html>
        `;

    return emailContent;
};
