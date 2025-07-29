export async function onRequest(context) {
    // *** החלף כאן את כתובת ה-Webhook שלך! ***
    const WEBHOOK_URL = 'https://mad.eseqtech.com/mad.eseqtech.com/9e38e452-ba2c-4eb1-83bc-7b2dc339e983EBHOOK_URL_HERE';

    // ודא שהבקשה היא מסוג POST
    if (context.request.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    try {
        // קבל את הנתונים מהטופס
        const formData = await context.request.json();

        // הכן את הנתונים לשליחה ל-Webhook
        const data = {
            name: formData.name,
            email: formData.email,
            message: formData.message
        };

        // שלח את הבקשה ל-Webhook שלך
        await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        // החזר תגובת הצלחה לדפדפן
        return new Response(JSON.stringify({ message: 'Success' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Error in worker:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}