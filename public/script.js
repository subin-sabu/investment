// public/script.js

const form = document.getElementById("quoteForm");
const button = document.getElementById("downloadBtn");

const premiumInput = document.getElementById("premium");
const pptInput = document.getElementById("ppt");
const ptInput = document.getElementById("pt");
const cagrInput = document.getElementById("cagr");
const premiumHint = document.getElementById("premiumHint");

// ----------------------------
// Live Premium Helper
// ----------------------------

premiumInput.addEventListener("input", () => {
    const value = Number(premiumInput.value);

    if (!value) {
        premiumHint.classList.add("hidden");
        premiumHint.textContent = "";
        return;
    }

    premiumHint.classList.remove("hidden");
    premiumHint.textContent =
        `${formatIndianAmount(value)} (${value.toLocaleString("en-IN")})`;
});

// ----------------------------
// Format Indian Amount
// ----------------------------

function formatIndianAmount(value) {

    if (value >= 10000000) {
        return `${Number((value / 10000000).toFixed(2))} Crore`;
    }

    if (value >= 100000) {
        return `${Number((value / 100000).toFixed(2))} Lakh`;
    }

    if (value >= 1000) {
        return `${Number((value / 1000).toFixed(2))} Thousand`;
    }

    return value.toLocaleString("en-IN");
}

// ----------------------------
// Download Quote
// ----------------------------

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const premium = Number(premiumInput.value);
    const ppt = Number(pptInput.value);
    const pt = Number(ptInput.value);
    const cagr = Number(cagrInput.value);

    // Validation
    if (!premium || premium <= 0) {
        alert("Please enter a valid Annual Premium.");
        premiumInput.focus();
        return;
    }

    if (!ppt || ppt < 1 || ppt > 40) {
        alert("Premium Paying Term must be between 1 and 40 years.");
        pptInput.focus();
        return;
    }

    if (!pt || pt < 1) {
        alert("Please enter a valid Policy Term.");
        ptInput.focus();
        return;
    }

    if (ppt > pt) {
        alert("Premium Paying Term cannot be greater than the Policy Term.");
        pptInput.focus();
        return;
    }

    if (!cagr || cagr <= 0) {
        alert("Please enter a valid Projected CAGR.");
        cagrInput.focus();
        return;
    }

    button.disabled = true;
    button.textContent = "Generating...";

    try {

        const response = await fetch("/generate-quote", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                premium,
                ppt,
                pt,
                cagr,
            }),
        });

        if (!response.ok) {
            const data = await response.json().catch(() => null);
            throw new Error(data?.message || "Failed to generate quote.");
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "InvestmentQuote.png";

        document.body.appendChild(a);
        a.click();
        a.remove();

        URL.revokeObjectURL(url);

    } catch (err) {

        alert(err.message);

    } finally {

        button.disabled = false;
        button.textContent = "Download Quote";

    }

});