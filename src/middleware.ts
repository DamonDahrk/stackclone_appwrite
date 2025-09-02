import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import getOrCreateDB from './models/server/dbSetup'
import getOrCreateStorage from './models/server/storageSetup'

// This function can be marked `async`
//  if using `await` inside
export async function middleware(request: NextRequest) {
    
    await Promise.all([
        getOrCreateDB(),
        getOrCreateStorage()
    ])
  
  
    return NextResponse.next()

  //important to keep .next() to continue the processing the request
  //without this it will be stuck in the middleware
}
// Whatever the path you are matching in the middleware,
//it will not be handled by the middleware.
export const config = {
    //starts with:
    // api
    // _next/static this is where static files are served
    // _next/image this is where images are served
    // favicon.com this is where favicon is served
    //A favicon ("favorite icon") is a small
    //  icon associated with a particular website



  matcher: [ "/((?!api|_next/static|_next/image|favicon.ico).*)"
],

}
