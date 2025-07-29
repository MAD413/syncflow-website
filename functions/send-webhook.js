export async function onRequest(context) {
    // Universal CORS headers
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    // טיפול בבקשת "preflight" של OPTIONS
    if (context.request.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    // אם זו בקשת POST, טפל בה
    if (context.request.method === 'POST') {
        // *** החלף כאן את כתובת ה-Webhook שלך! ***
        const WEBHOOK_URL = 'https://mad.eseqtech.com/mad.eseqtech.com/9e38e452-ba2c-4eb1-83bc-7b2dc339e983';

        try {
            const formData = await context.request.json();
            const data = {
                name: formData.name,
                email: formData.email,
                message: formData.message
            };

            // שלח את הבקשה ל-Webhook שלך
            await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            // החזר תגובת הצלחה
            return new Response(JSON.stringify({ message: 'Success' }), {
                status: 200,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });

        } catch (error) {
            console.error('Error in worker:', error);
            return new Response('Internal Server Error', { status: 500, headers: corsHeaders });
        }
    }
    
    // אם זו כל שיטה אחרת (כמו GET), החזר 405
    return new Response('Method Not Allowed', {
        status: 405,
        headers: corsHeaders,
    });
}