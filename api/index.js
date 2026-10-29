export default async function handler(req, res) {
  // CORS taake browser/app se error na aaye
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const phone = req.query.phone;
  const count = req.query.count || 1;

  if (!phone) {
    return res.status(400).json({ 
      error: "Phone parameter is required.", 
      Developer: "Dev NexGen Tech" 
    });
  }

  const targetApiUrl = `https://smsbomberapi-ruby.vercel.app/api/send?phone=${phone}&count=${count}`;

  try {
    const response = await fetch(targetApiUrl);
    let data = await response.json();

    // 1. Ramzan Ahsan aur Job ID ko direct delete karna
    delete data.dev;
    delete data.job_id;

    // 2. Baqi faltu links ya groups hatana
    const keysToDelete = ['group_link', 'group', 'telegram', 'whatsapp', 'channel', 'link', 'owner'];
    
    for (let key in data) {
      if (keysToDelete.includes(key.toLowerCase())) {
        delete data[key];
      } else if (typeof data[key] === 'string' && data[key].includes('http')) {
        data[key] = data[key].replace(/(https?:\/\/[^\s]+)/g, '').trim();
      }
    }

    // 3. Apna naam add karna
    data.Developer = "Dev NexGen Tech";
    
    res.status(200).json(data);
    
  } catch (error) {
    res.status(500).json({ 
      error: "API is currently down or not responding.", 
      Developer: "Dev NexGen Tech" 
    });
  }
}

