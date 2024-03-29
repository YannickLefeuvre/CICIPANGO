package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Fichiay;
import com.mycompany.myapp.domain.ListFichiers;
import com.mycompany.myapp.domain.Photo;
import com.mycompany.myapp.repository.PhotoRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Photo}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class PhotoResource {

    private final Logger log = LoggerFactory.getLogger(PhotoResource.class);

    private static final String ENTITY_NAME = "photo";

    Long lastAlbumPhotoId;
    int LastnbSecret;

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PhotoRepository photoRepository;

    public PhotoResource(PhotoRepository photoRepository) {
        this.photoRepository = photoRepository;
    }

    /**
     * {@code POST  /photos} : Create a new photo.
     *
     * @param photo the photo to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new photo, or with status {@code 400 (Bad Request)} if the photo has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/photos")
    public ResponseEntity<Photo> createPhoto(@RequestBody Photo photo) throws URISyntaxException {
        log.debug("REST request to save Photo : {}", photo);
        if (photo.getId() != null) {
            throw new BadRequestAlertException("A new photo cannot already have an ID", ENTITY_NAME, "idexists");
        }
        //        SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
        Date date = new Date();
        photo.setDate_creation(date);

        Photo result = photoRepository.save(photo);
        this.LastnbSecret = result.getNbSecret();
        this.lastAlbumPhotoId = result.getId();
        return ResponseEntity
            .created(new URI("/api/photos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    @PostMapping("/photosfile/{id}")
    public ResponseEntity<Fichiay> createAudioFile(
        @RequestBody Fichiay fichou,
        @PathVariable(value = "id", required = false) final Long id
    ) throws URISyntaxException, IOException {
        log.debug("NOOOOOOOOOOOOOOOOOOOOON YUHHUUUUU");

        if (fichou.getNbFichier() != this.LastnbSecret) {
            throw new BadRequestAlertException(
                "Nb Secrets pas égales:" + this.LastnbSecret + " DUDU " + fichou.getNbFichier(),
                ENTITY_NAME,
                "idinvalid"
            );
        }

        //       try (FileOutputStream fos = new FileOutputStream("C:\\temp\\audio\\nanmiou" + lastAudioId + ".txt")) {
        try (FileOutputStream fos = new FileOutputStream("C:\\resources\\content\\photos\\bibi" + id + "." + fichou.getExt())) {
            fos.write(fichou.getFichier());
            //fos.close(); There is no more need for this line since you had created the instance of "fos" inside the try. And this will automatically close the OutputStream
        }

        return ResponseEntity
            .created(new URI("/api/audiofile"))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, "hoo"))
            .body(fichou);
    }

    /**
     * {@code PUT  /photos/:id} : Updates an existing photo.
     *
     * @param id the id of the photo to save.
     * @param photo the photo to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated photo,
     * or with status {@code 400 (Bad Request)} if the photo is not valid,
     * or with status {@code 500 (Internal Server Error)} if the photo couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/photos/{id}")
    public ResponseEntity<Photo> updatePhoto(@PathVariable(value = "id", required = false) final Long id, @RequestBody Photo photo)
        throws URISyntaxException {
        log.debug("REST request to update Photo : {}, {}", id, photo);
        if (photo.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, photo.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!photoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }
        Date date = new Date();
        photo.setDate_creation(date);
        Photo result = photoRepository.save(photo);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, photo.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /photos/:id} : Partial updates given fields of an existing photo, field will ignore if it is null
     *
     * @param id the id of the photo to save.
     * @param photo the photo to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated photo,
     * or with status {@code 400 (Bad Request)} if the photo is not valid,
     * or with status {@code 404 (Not Found)} if the photo is not found,
     * or with status {@code 500 (Internal Server Error)} if the photo couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/photos/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Photo> partialUpdatePhoto(@PathVariable(value = "id", required = false) final Long id, @RequestBody Photo photo)
        throws URISyntaxException {
        log.debug("REST request to partial update Photo partially : {}, {}", id, photo);
        if (photo.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, photo.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!photoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Photo> result = photoRepository
            .findById(photo.getId())
            .map(existingPhoto -> {
                if (photo.getImages() != null) {
                    existingPhoto.setImages(photo.getImages());
                }
                if (photo.getImagesContentType() != null) {
                    existingPhoto.setImagesContentType(photo.getImagesContentType());
                }
                if (photo.getDescription() != null) {
                    existingPhoto.setDescription(photo.getDescription());
                }

                return existingPhoto;
            })
            .map(photoRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, photo.getId().toString())
        );
    }

    /**
     * {@code GET  /photos} : get all the photos.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of photos in body.
     */
    @GetMapping("/photos")
    public List<Photo> getAllPhotos() {
        log.debug("REST request to get all Photos");
        return photoRepository.findAll();
    }

    /**
     * {@code GET  /photos/:id} : get the "id" photo.
     *
     * @param id the id of the photo to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the photo, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/photos/{id}")
    public ResponseEntity<Photo> getPhoto(@PathVariable Long id) {
        log.debug("REST request to get Photo : {}", id);
        Optional<Photo> photo = photoRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(photo);
    }

    /**
     * {@code DELETE  /photos/:id} : delete the "id" photo.
     *
     * @param id the id of the photo to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/photos/{id}")
    public ResponseEntity<Void> deletePhoto(@PathVariable Long id) {
        log.debug("REST request to delete Photo : {}", id);
        photoRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
