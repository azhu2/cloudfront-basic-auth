# cloudfront-basic-auth
A Lambda@Edge function that password-protects pages behind a Cloudfront distribution.
This is useful for static (i.e. S3-hosted) sites on Cloudfront without involving a full webserver and is more flexible than other [solutions](https://stackoverflow.com/a/46522434) such as
* [staticcrypt](https://github.com/robinmoisson/staticrypt) - doesn't require re-encrypting everything upon rebuilding and since browsers persist Basic auth credentials, users don't need to reenter passwords and assets can be protected too.
* [hiding in an unlisted subdirectory](https://github.com/matteobrusa/Password-protection-for-static-pages) - not compromised by browser history or directory listing

Also has configuration for public (non-protected pages).

## Is this secure?
Not really, but it's good enough for casual use if you enforce TLS and have a strong password. I set it up for a wedding website, you probably don't want to use it to hide any actually sensitive material.
