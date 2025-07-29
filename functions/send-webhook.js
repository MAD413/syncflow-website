// This is the only file you need in the /functions directory.

export default {
    async fetch(request, env, ctx) {
        // Headers אוניברסליים שמרשים הכל, כדי למנוע בעיות CORS
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        };

        // שלב 1: טיפול בבקשת "preflight" של OPTIONS שהדפדפן שולח
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        // שלב 2: טיפול בבקשת POST מהטופס
        if (request.method === 'POST') {
            // *** החלף כאן את כתובת ה-Webhook שלך! ***
            const WEBHOOK_URL = 'https://mad.eseqtech.com/mad.eseqtech.com/9e38e452-ba2c-4eb1-83bc-7b2dc339e983';

            try {
                // קריאת הנתונים מהטופס
                const formData = await request.json();
                
                const dataToSend = {
                    name: formData.name,
                    email: formData.email,
                    message: formData.message
                };

                // שליחת הנתונים ל-Webhook שלך
                await fetch(WEBHOOK_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dataToSend)
                });

                // החזרת תגובת הצלחה לדפדפן
                return new Response(JSON.stringify({ message: 'Success' }), {
                    status: 200,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });

            } catch (error) {
                console.error('Error in worker:', error);
                return new Response('Internal Server Error', { status: 500, headers: corsHeaders });
            }
        }
        
        // שלב 3: אם הבקשה היא לא POST ולא OPTIONS, החזר שגיאה
        return new Response('Method Not Allowed', {
            status: 405,
            headers: corsHeaders,
        });
    }
};