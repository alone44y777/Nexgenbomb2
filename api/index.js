export default async function handler(req, res) {
  // Extract phone and count from your API request
  const phone = req.query.phone;
  const count = req.query.count || 1;

  if (!phone) {
    return res.status(400).json({ error: "Phone parameter is required" });
  }

  // Target API URL
  const targetApiUrl = `https://smsbomberapi-ruby.vercel.app/api/send?phone=${phone}&count=${count}`;

  try {
    const response = await fetch(targetApiUrl);
    let data = await response.json();

    // 1. Group link remove karna 
    // JSON mein agar explicitly group link ka key hai toh usay delete karega
    const keysToDelete = ['group_link', 'group', 'telegram', 'whatsapp', 'channel', 'link'];
    
    for (let key in data) {
      // Agar key ka naam group link se milta hai
      if (keysToDelete.includes(key.toLowerCase())) {
        delete data[key];
      }
      // Agar link kisi string message ke andar chupa hua hai, toh URL hata dega
      else if (typeof data[key] === 'string' && data[key].includes('http')) {
        data[key] = data[key].replace(/(https?:\/\/[^\s]+)/g, '').trim();
      }
    }

    // 2. Apna custom response add karna
    data.Developer = "Dev NexGen_Tech_Zone-PK";
    
    // Final modified response return karna
    res.status(200).json(data);
    
  } catch (error) {
    res.status(500).json({ 
      error: "Error fetching from target API", 
      details: error.message 
    });
  }
}
