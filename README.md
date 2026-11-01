# Image Editor

Filerobot Image Editor runs locally in its own lazy-loaded app bundle, with its
own React 18 dependencies. It never requests a cloud image or a translation
service. Open a PNG, JPEG or WebP from Files; save writes to the shared account
mirror using the opened version. Browser storage then synchronizes to the file
service. Closing the window disposes the editor and releases its image data. Filerobot's
built-in download is suppressed; the user saves to account files instead.
Use **File → Open from My files** to select an image. An image that cannot be opened
leaves the current edits available. Save updates the opened file. **Save As**
in the File menu chooses a separate PNG, JPEG or WebP path in My files and asks before replacing
an existing file; subsequent saves update the new file. Change monitoring and Save As collision checks use file metadata without rereading image bytes. Animated GIF editing is
not supported.

Run `npm ci --prefix apps/system/image-editor --ignore-scripts` before the
public app builder. Generated dependencies and output are not tracked.

Local desktop, phone-sized and 4K-sized, and live desktop and phone-sized tests use two accounts in one browser and delay an image save across an account switch; the old save changes neither account’s file. Physical-device touch is not covered.

A separate notice remains visible if My files detects that the open image changed, is unavailable, or has conflicting copies. The current image and edits remain open; resolve conflicts in Files or save a copy. A save that lands in conflict reports that it is saved locally and needs resolution rather than claiming server sync. Detection depends on My files synchronization. Local desktop, emulated-phone and 4K and live emulated-phone account tests cover conflicts before and during saves and fresh-session recovery.

**New blank image** creates a white 800 × 600 PNG canvas in the browser. It is unsaved until saved to My files; the default name is `/Untitled.png`, and an existing file is protected. Use Save As for another name or folder. Starting another blank image asks before discarding unsaved edits. Local desktop, emulated-phone and 4K and live emulated-phone account tests cover the close warning, name collision, resize, save, sync and fresh-session reopen.

Once an image is open, New, Open and Save As are in the editor's File menu
beside its Save button. If that toolbar cannot be found, a fallback File menu
appears. Upload from the computer remains available separately in Files.

Open, New and Save As use desktop confirmations. The editor waits for pending
edit notifications before checking unsaved work, and checks again after a
confirmation so newer edits are not discarded. An image changed during a
replacement confirmation is protected by its file version.
