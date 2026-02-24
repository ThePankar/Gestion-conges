Leave-Management

Free leave manager via Google Sheets. Track vacation/RTT, interactive calendar, and smart optimization of long weekends. Web App installable on mobile.

📅 Leave & RTT ManagerFree and open-source web application to manage leave, RTT, and optimize long weekends via Google Sheets.

Application Preview (Tip: Replace this link with a real screenshot of your application hosted on an image site like Imgur)

✨ Features📊 Visual Dashboard: Real-time tracking of Paid Leave (CP) and RTT balances with donut charts.

🗓️ Interactive Calendar: Monthly and yearly views with display of public holidays, weekends, and taken leave.

🚀 Smart Optimization:Automatic "Bridge Day" detection (e.g., if a holiday is on a Thursday -> suggest taking Friday off).Calculation of the best periods to take N days off and maximize rest time.

⚡ Ultra Fast: Optimization calculations are done locally in the browser (no loading time).

📱 App Mode (PWA): Install it on your smartphone (iOS/Android) to use it like a real offline app.

🔒 100% Private: All data is stored in your own Google Drive (Google Sheets). No external server.

🛠️ Technologies UsedBackend: Google Apps Script (free server integrated with Google).Database: Google Sheets.Frontend: HTML5, CSS3 (Vanilla), JavaScript (ES6).Charts: Native SVG (no heavy libraries).

🚀 Installation (Detailed Guide)Since the application uses your Google Drive as a database, you need to create a copy for yourself.

Step 1: Prepare the Google SheetGo to Google Sheets and create a new empty spreadsheet.Name it "Leave Management" (or whatever you prefer).

Step 2: Open the Script EditorIn your spreadsheet, go to Extensions > Apps Script.A new tab will open. This is the code editor.

Step 3: Copy the CodeIn the editor, you will see a file named Code.gs. Replace all its content with the code from the Code.gs file in this GitHub repository.Click the + (on the left, near "Files") > HTML. Name the file Index (without the .html).Replace all the content of this file with the code from the Index.html file in this repository.

Step 4: Deploy the ApplicationIn the Apps Script editor, click Deploy (top right) > New deployment.Click the ⚙️ icon > Web app.Description: Version 1.Execute as: Me.Who has access: Anyone (if you want to access it from anywhere) or Me only.Click Deploy.

Step 5: Authorize AccessGoogle will ask you to authorize the script.Click "Authorize".If Google tells you the app is unverified (this is normal, it's your own code), click Advanced > Go to Leave Management (unsafe) > Authorize.

Step 6: Ready to Go!You will get a URL. Copy it and open it in your browser. The application will initialize the sheets automatically.

📱 Smartphone InstallationTo use the app like a real native application:

Open your application URL on your phone.On iPhone (Safari): Press the Share button > "Add to Home Screen".

On Android (Chrome): Press the menu (3 dots) > "Add to Home Screen".

⚙️ ConfigurationYou can adjust constants in the Code.gs file:

const CONFIG = { ANNEE_BASE_CP: 25, // Base number of paid leave days per year FORFAIT_JOURS: 218 // Number of working days in the year};
