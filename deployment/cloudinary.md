# Cloudinary Configuration Guide - AgeSense Image Storage

This document guides you on setup, folders, restrictions, and usage details for the Cloudinary integration.

## Folder Structure

All uploaded images will be structured automatically under the following folders:

```text
agesense/
  ├── programs/         # Images for public programs
  ├── impact-stories/   # Images for testimonials and impact stories
  ├── gallery/          # Public event and chapter photos
  └── partners/         # NGO and corporate partner logos
```

* **Default**: Falls back to `agesense/general` if no category is specified in upload query parameter.

## Upload Limits

* **Max File Size**: 5MB (validated in the multer configuration in backend).

## Allowed Types

Only images of type:
* `image/jpeg`
* `image/jpg`
* `image/png`
* `image/webp`

are permitted. Multer will block other files.

## API Usage

The backend exposes an image upload proxy.
* **Endpoint**: `POST /api/admin/upload?folder=[folder_type]`
* **Authentication**: Requires a valid admin Authorization header (`Bearer <token>`).
* **Payload**: Form data with key `image`.
* **Response**: Returns `{ success: true, imageUrl: "..." }`.
