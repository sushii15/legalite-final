import fs from 'fs';

let content = fs.readFileSync('generate-explanations.mjs', 'utf-8');

// Fix model name - change gemini-1.5-flash to gemini-1.5-pro
content = content.replace(/model: "gemini-1.5-flash"/g, 'model: "gemini-1.5-pro"');

// Fix file mappings
content = content.replace(
  '"crpc-bare-act": "Code of Criminal Procedure",',
  '"crpc-bare-act-1973": "Code of Criminal Procedure 1973",'
);

content = content.replace(
  '"crpc-bare-act-1973": "Code of Criminal Procedure 1973",',
  ''
);

// Fix the keyword mapping
content = content.replace(
  '"criminal procedure": "crpc-bare-act",',
  '"criminal procedure": "crpc-bare-act-1973",'
);

content = content.replace(
  '"crpc": "crpc-bare-act",',
  '"crpc": "crpc-bare-act-1973",'
);

content = content.replace(
  '"motor vehicles": "crpc-bare-act",',
  '"motor vehicles": "crpc-bare-act-1973",'
);

// Fix the muslim women protection mapping
content = content.replace(
  '"muslim-women-protection-of-rights-on-div": "Muslim Women (Protection of Rights on Divorce) Act",',
  '"muslim-women-protection-of-rights-on-divorce-act-1986": "Muslim Women (Protection of Rights on Divorce) Act",'
);

content = content.replace(
  '"muslim women": "muslim-women-protection-of-rights-on-div",',
  '"muslim women": "muslim-women-protection-of-rights-on-divorce-act-1986",'
);

fs.writeFileSync('generate-explanations.mjs', content);
console.log('✅ Script updated with correct model and file mappings');
