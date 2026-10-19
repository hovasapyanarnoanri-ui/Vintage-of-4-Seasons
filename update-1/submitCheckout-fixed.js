function submitCheckout(e){
  e.preventDefault();
  const box=document.getElementById('checkoutConfirm');
  if(!CHECKOUT_URL){
    box.innerHTML=`<h2>Preview</h2><p>On the live site, this button opens Stripe's secure payment page with your cart and shipping already filled in.</p><button class="btn secondary" type="button" onclick="go('shop')">Keep Shopping</button>`;
    document.getElementById('checkoutForm').classList.add('hide');
    box.classList.add('show');
    return;
  }
  const lineItems=cart.map(c=>{
    const prod=products[c.idx];
    if(!prod||!prod.stripePrice){throw new Error('Missing Stripe price for '+(prod&&prod.n));}
    return {priceId:prod.stripePrice,name:prod.n,color:c.color||'',qty:c.qty||1};
  });
  const params=new URLSearchParams({
    cart:JSON.stringify(lineItems),
    zip:val('zipCheckout'),
    email:val('emailCheckout'),
    name:val('nameCheckout'),
    phone:val('phoneCheckout'),
    addr:val('addrCheckout')
  });
  const url=CHECKOUT_URL+'?'+params.toString();
  box.innerHTML=`<h2>Taking You to Secure Payment…</h2><p>Payment is handled on Stripe's secure page. If it doesn't open on its own, tap the button below.</p><a class="btn primary" href="${url.replace(/&/g,'&amp;')}" target="_blank" rel="noopener">Pay Securely with Stripe</a><p class="note" style="margin-top:14px">Your cart stays saved if you come back.</p><button class="btn secondary" type="button" onclick="go('shop')">Keep Shopping</button>`;
  document.getElementById('checkoutForm').classList.add('hide');
  box.classList.add('show');
  window.open(url,'_blank','noopener');
}
