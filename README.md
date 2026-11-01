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
an existing file; subsequent saves update the new file. Change monitoring and Save As collision checks use file metadata without rereading image bytes. Animated GIF, APNG and animated WebP editing is
not supported. Animated PNG and WebP files are rejected before the editor
decodes them, protecting their frames from a still-image save; other currently
open edits remain intact.

Before decoding, the editor checks that the image signature matches its PNG,
JPEG or WebP filename. A mismatch is rejected and the current image stays open;
the browser still validates the full image when it decodes it.

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

The editor also asks before closing while Save or Save As is in
progress, even if the image was clean when the save began. A cancelled or failed
save restores the previous clean state unless a newer edit occurred. An
already-dispatched file write may still finish after the window closes.

The app updates the window's restore reference when opening or
saving an image, and clears it when creating a new blank image. An unsaved blank
is not preserved on refresh; save it first. The earlier saved image is not
reopened in its place.

Focused Ctrl/Command+S uses the image Save action. For immediate resize/save,
the app waits one event turn and snapshots the current editor state; local
desktop and emulated-phone checks verified saved dimensions. Other tools,
physical touch and Mac shortcuts remain unverified.


Watermark → Add watermark → **Choose watermark from My files** selects a PNG,
JPEG or WebP already on the account drive. **File → Choose annotation image
from My files** prepares one image for Annotate → Image → Add image → From
gallery. Select its thumbnail and tap outside the gallery before saving; the
upstream gallery overlay otherwise covers Save. The gallery is temporary for
the current image, while saving the edited image embeds the visible overlay.
The separate Annotate → Image → Upload image action still opens the computer
file picker; it is retained for computer uploads. Animated overlays are not
supported. Local desktop and emulated-phone tests cover both My files paths,
image validation, saved pixel content and server sync, and observed no external
requests in those flows. Physical touch, all image formats and very large
overlays remain unverified.

No third-party account or cloud feature was removed in this review. The native
computer-upload path for annotations remains; direct My files annotation
insertion without the intermediate gallery is a future usability improvement.

If a missing, invalid, unsupported or undecodable image cannot be opened while
a window is restored, its failed file association is cleared. A temporary file
read failure keeps the association so a later refresh can retry. The original
file is untouched; choose another image or create a blank one. Local desktop and emulated-phone
account tests cover invalid/missing images, creating and saving a blank image,
server synchronization and refresh. Physical touch remains unverified.

When Save As targets an existing filename, the editor checks the existing
version before and after replacement confirmation. This includes a new blank
image replacing an existing `/Untitled.png`; cancelling or an intervening edit
preserves that file. Local desktop and emulated-phone account tests cover these
cases, successful replacement and server sync. Physical touch remains unverified.

A new blank image uses `/Untitled.png`; if that file already exists, ordinary
Save offers a version-checked replacement confirmation. Cancelling or changing
that target during confirmation leaves the original untouched. Local desktop
and emulated-phone account tests cover cancellation, concurrent modification,
confirmed replacement, server sync and refresh. Physical touch is unverified.

The Save As folder chooser ignores a late selection if the image or proposed
filename changed while it was open; choose the folder again in that case. Only
one chooser can run at a time. Local desktop and emulated-phone account tests
cover a stale filename, a valid folder choice, server synchronization and
reopening the saved image in a fresh session. Physical touch remains unverified.

When restoring an image fails because storage is temporarily unavailable, **Retry
saved image** reopens it without refreshing the desktop. Scratch work asks for
confirmation before retry, and if the unavailable original is `/Untitled.png`,
the blank scratch defaults to `/Untitled-recovery.png`. Saving or opening another
image clears the retry target. Local registered-account desktop and emulated-phone
tests covered cancellation, retry, real resize/save, server sync, reopen and a
separate scratch save that preserved the original. Physical touch and other
failure types remain unverified.

Saving a PNG or WebP as JPEG asks before converting: JPEG uses lossy compression
and cannot retain transparency. Cancel leaves the image and destination file
untouched. If the image or destination changes while the question is open,
the app asks the user to start the save again. Existing JPEG saves do not ask
for this conversion confirmation.
