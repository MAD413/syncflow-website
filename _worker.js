export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);

        if (url.pathname === "/send-webhook") {
            const corsHeaders = {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            };

            if (request.method === "OPTIONS") {
                return new Response(null, { headers: corsHeaders });
            }

            if (request.method === "POST") {
                try {
                    const WEBHOOK_URL = 'https://mad.eseqtech.com/mad.eseqtech.com/9e38e452-ba2c-4eb1-83bc-7b2dc339e983'; // *** החלף כאן ***
                    const formData = await request.json();
                    const dataToSend = {
                        name: formData.name, email: formData.email, message: formData.message
                    };

                    await fetch(WEBHOOK_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(dataToSend)
                    });

                    return new Response(JSON.stringify({ message: "Success" }), {
                        status: 200,
                        headers: { ...corsHeaders, "Content-Type": "application/json" },
                    });
                } catch (error) {
                    return new Response("Internal Server Error", { status: 500, headers: corsHeaders });
                }
            }

            return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
        }

        return env.ASSETS.fetch(request);
    }
};