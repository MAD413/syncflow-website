export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);

        // בדוק אם הנתיב הוא /send-webhook
        if (url.pathname === "/send-webhook") {

            // Headers אוניברסליים כדי למנוע כל בעיית CORS
            const corsHeaders = {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': '*',
            };
            
            // אם זו בקשת POST, נסה לקרוא את הגוף ולהחזיר אותו
            if (request.method === "POST") {
                try {
                    const body = await request.json();
                    const responseBody = {
                        message: "Worker received POST request successfully!",
                        receivedData: body,
                    };
                    return new Response(JSON.stringify(responseBody), {
                        status: 200,
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    });
                } catch (e) {
                     return new Response("Failed to parse JSON body", { status: 400, headers: corsHeaders });
                }
            }

            // לכל בקשה אחרת (כמו OPTIONS או GET), פשוט החזר OK
            return new Response("OK", { headers: corsHeaders });
        }

        // לכל נתיב אחר, הגש את קבצי האתר הסטטיים
        return env.ASSETS.fetch(request);
    }
};