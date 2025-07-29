export async function onRequestPost(context) {
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
            headers: { 
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            }
        });

    } catch (error) {
        console.error('Error in worker:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}