export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);

        // --- ניתוב (Routing) ---
        // אם הנתיב הוא /send-webhook, הפעל את לוגיקת הטופס
        if (url.pathname === "/send-webhook") {
            return handleFormSubmit(request);
        }

        // לכל נתיב אחר, הגש את הקבצים הסטטיים של האתר
        return env.ASSETS.fetch(request);
    }
};

// פונקציית עזר לטיפול בטופס
async function handleFormSubmit(request) {
    // Headers אוניברסליים ל-CORS
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    // טיפול בבקשת OPTIONS
    if (request.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    // טיפול בבקשת POST
    if (request.method === 'POST') {
        // *** החלף כאן את כתובת ה-Webhook שלך! ***
        const WEBHOOK_URL = 'https://mad.eseqtech.com/mad.eseqtech.com/9e38e452-ba2c-4eb1-83bc-7b2dc339e983';

        try {
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

            return new Response(JSON.stringify({ message: 'Success' }), {
                status: 200,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });

        } catch (error) {
            console.error('Error in worker:', error);
            return new Response('Internal Server Error', { status: 500, headers: corsHeaders });
        }
    }
    
    // אם הבקשה ל-/send-webhook היא לא POST ולא OPTIONS
    return new Response('Method Not Allowed', {
        status: 405,
        headers: corsHeaders,
    });
}