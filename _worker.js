export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);

        // בדוק אם הנתיב המבוקש הוא נקודת הקצה של הטופס שלנו
        if (url.pathname === "/send-webhook") {

            // טפל בבקשת OPTIONS (CORS preflight) שהדפדפן שולח
            if (request.method === "OPTIONS") {
                return new Response(null, {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods": "POST, OPTIONS",
                        "Access-Control-Allow-Headers": "Content-Type",
                    },
                });
            }

            // טפל בבקשת POST של הטופס
            if (request.method === "POST") {
                try {
                    // *** החלף כאן את כתובת ה-Webhook שלך! ***
                    const WEBHOOK_URL = 'https://mad.eseqtech.com/mad.eseqtech.com/9e38e452-ba2c-4eb1-83bc-7b2dc339e983';
                    
                    const formData = await request.json();
                    const dataToSend = {
                        name: formData.name,
                        email: formData.email,
                        message: formData.message
                    };

                    await fetch(WEBHOOK_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(dataToSend)
                    });

                    // החזר תגובת הצלחה לדפדפן
                    return new Response(JSON.stringify({ message: "Success" }), {
                        status: 200,
                        headers: {
                            "Access-Control-Allow-Origin": "*",
                            "Content-Type": "application/json",
                        },
                    });

                } catch (error) {
                    console.error('Error in worker:', error);
                    return new Response("Internal Server Error", { status: 500 });
                }
            }

            // אם הבקשה ל-/send-webhook היא לא POST או OPTIONS, היא לא מורשית
            return new Response("Method Not Allowed", { status: 405 });
        }

        // לכל בקשה אחרת שאינה /send-webhook, הגש את קבצי האתר הסטטיים
        return env.ASSETS.fetch(request);
    }
};