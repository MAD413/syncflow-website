export async function onRequest(context) {
    // Universal CORS headers that allow everything
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': '*',
    };
    
    // Immediately handle OPTIONS request for CORS preflight
    if (context.request.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    // For any other request (POST, GET, etc.), try to process it as a POST
    // This is for debugging purposes to bypass the 405 error
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

            await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
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

    // If it's NOT a POST request, just return a simple OK message instead of 405
    return new Response('Request received, but expecting POST.', {
        status: 200,
        headers: corsHeaders
    });
}