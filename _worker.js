export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);

        // אם הנתיב הוא /submit-form, הפעל את לוגיקת הטופס
        if (url.pathname === "/submit-form") {
            // טפל רק בבקשות POST
            if (request.method === "POST") {
                try {
                    // *** החלף כאן את כתובת ה-Webhook שלך! ***
                    const WEBHOOK_URL = 'https://mad.eseqtech.com/mad.eseqtech.com/9e38e452-ba2c-4eb1-83bc-7b2dc339e983';
                    
                    // קרא את הנתונים מהטופס (בפורמט FormData, לא JSON)
                    const formData = await request.formData();
                    const body = Object.fromEntries(formData);

                    await fetch(WEBHOOK_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(body)
                    });

                    // הפנה את המשתמש חזרה לדף הבית עם הודעת הצלחה
                    // ודא שהכתובת כאן היא הדומיין המלא שלך!
                    const successUrl = new URL("/", url);
                    successUrl.searchParams.set("success", "true");
                    return Response.redirect(successUrl, 302);

                } catch (error) {
                    console.error('Error in worker:', error);
                    // במקרה של שגיאה, הפנה חזרה עם הודעת שגיאה
                    const errorUrl = new URL("/", url);
                    errorUrl.searchParams.set("error", "true");
                    return Response.redirect(errorUrl, 302);
                }
            }
            // אם הבקשה היא לא POST, היא לא מורשית
            return new Response("Method Not Allowed", { status: 405 });
        }

        // לכל נתיב אחר, הגש את קבצי האתר הסטטיים
        return env.ASSETS.fetch(request);
    }
};