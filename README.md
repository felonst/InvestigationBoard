# Investigation Link Board

සිංහලෙන් සකස් කළ, GitHub Pages මත ධාවනය කළ හැකි විමර්ශන සම්බන්ධතා සිතියමකි.

## අඩංගු විශේෂාංග
- පුද්ගලයන්, දුරකථන, සමාජ මාධ්‍ය ගිණුම්, වාහන, ව්‍යාපාර, රැකියා, ඊමේල්, ලිපින, උපකරණ, වෙබ් අඩවි, crypto wallets, ගිණුම්, ලේඛන, සිදුවීම් සහ ස්ථාන එක් කිරීම.
- අයිතම අතර නමක් සහ සටහන් සහිත සම්බන්ධතා සෑදීම.
- සිතියමේ අයිතම drag කිරීම, zoom කිරීම සහ pan කිරීම.
- අයිතම විස්තර/මූලාශ්‍ර/තහවුරු කිරීමේ තත්ත්වය සටහන් කිරීම.
- බ්‍රවුසරයේ Local Storage තුළ ස්වයංක්‍රීයව සුරැකීම.
- JSON Export.
- A4 print layout; Print සංවාදයෙන් **Save as PDF** තෝරා PDF ලබාගත හැක.

## GitHub Pages වෙත දැමීම
1. GitHub හි අලුත් repository එකක් සාදන්න.
2. `index.html`, `styles.css`, `app.js`, `README.md` upload කරන්න.
3. Repository එකේ **Settings → Pages** වෙත යන්න.
4. **Deploy from a branch** තෝරා `main` සහ `/(root)` තෝරා Save කරන්න.
5. Pages URL එක විවෘත කරන්න.

## භාවිතය
1. විමර්ශන නාමය සහ යොමු අංකය පුරවන්න.
2. වම් පස form එකෙන් අයිතම එක් කරන්න.
3. අයිතම දෙකක් තෝරා **සම්බන්ධ කරන්න** ඔබන්න; සම්බන්ධතාවේ නමක් දෙන්න.
4. අයිතමයක් double-click කර සංස්කරණය කළ හැක.
5. **A4 / PDF Print** ඔබා print dialog එකේ **Save as PDF** තෝරන්න.

## වැදගත් සීමා
- මෙම prototype එක දත්ත ඔබේ browser එකේ Local Storage තුළ තබයි. වෙනත් පරිගණකයකට හෝ browser එකකට ස්වයංක්‍රීයව sync නොවේ.
- Browser data clear කළොත් දත්ත නැති විය හැක. නිතර JSON Export කරන්න.
- මෙය encrypted case-management system එකක්, audit log එකක් හෝ නිල evidence repository එකක් නොවේ. සංවේදී විමර්ශන දත්ත ඇතුළත් කිරීමට පෙර ආරක්ෂාව, ප්‍රවේශ පාලනය සහ නීතිමය අවශ්‍යතා සලකා බලන්න.
- Network visualization සඳහා vis-network CDN භාවිතා කරන නිසා පළමු වරට load වීමට internet අවශ්‍ය වේ.
