package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Audio;
import com.mycompany.myapp.domain.Fichiay;
import com.mycompany.myapp.repository.AudioRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import io.undertow.server.handlers.form.FormData;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.source.ConfigurationPropertyName.Form;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.testcontainers.shaded.org.apache.commons.io.FileUtils;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Audio}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class AudioResource {

    private final Logger log = LoggerFactory.getLogger(AudioResource.class);

    private static final String ENTITY_NAME = "audio";

    Long lastAudioId;
    int LastnbSecret;

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AudioRepository audioRepository;

    public AudioResource(AudioRepository audioRepository) {
        this.audioRepository = audioRepository;
    }

    /**
     * {@code POST  /audio} : Create a new audio.
     *
     * @param audio the audio to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with
     *         body the new audio, or with status {@code 400 (Bad Request)} if the
     *         audio has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/audio")
    public ResponseEntity<Audio> createAudio(@RequestBody Audio audio) throws URISyntaxException {
        log.debug("REST request to save Audio : {}", audio);
        if (audio.getId() != null) {
            throw new BadRequestAlertException("A new audio cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Date date = new Date();
        audio.setDate_creation(date);

        Audio result = audioRepository.save(audio);
        this.LastnbSecret = result.getNbSecret();
        this.lastAudioId = result.getId();

        return ResponseEntity
            .created(new URI("/api/audio/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    @PostMapping("/audiofile/{id}")
    public ResponseEntity<Fichiay> createAudioFile(
        @RequestBody Fichiay fichou,
        @PathVariable(value = "id", required = false) final Long id
    ) throws URISyntaxException, IOException {
        // try (FileOutputStream fos = new FileOutputStream("C:\\temp\\audio\\nanmiou" +
        // lastAudioId + ".txt")) {
        try (FileOutputStream fos = new FileOutputStream("C:\\resources\\content\\audios\\bibu" + id + "." + fichou.getExt())) {
            fos.write(fichou.getFichier());
            // fos.close(); There is no more need for this line since you had created the
            // instance of "fos" inside the try. And this will automatically close the
            // OutputStream
        }

        return ResponseEntity
            .created(new URI("/api/audiofile"))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, "hoo"))
            .body(fichou);
    }

    /**
     * {@code PUT  /audio/:id} : Updates an existing audio.
     *
     * @param id    the id of the audio to save.
     * @param audio the audio to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
     *         the updated audio, or with status {@code 400 (Bad Request)} if the
     *         audio is not valid, or with status
     *         {@code 500 (Internal Server Error)} if the audio couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/audio/{id}")
    public ResponseEntity<Audio> updateAudio(@PathVariable(value = "id", required = false) final Long id, @RequestBody Audio audio)
        throws URISyntaxException {
        log.debug("REST request to update Audio : {}, {}", id, audio);
        if (audio.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, audio.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!audioRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }
        Date date = new Date();
        audio.setDate_creation(date);
        Audio result = audioRepository.save(audio);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, audio.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /audio/:id} : Partial updates given fields of an existing
     * audio, field will ignore if it is null
     *
     * @param id    the id of the audio to save.
     * @param audio the audio to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
     *         the updated audio, or with status {@code 400 (Bad Request)} if the
     *         audio is not valid, or with status {@code 404 (Not Found)} if the
     *         audio is not found, or with status
     *         {@code 500 (Internal Server Error)} if the audio couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/audio/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Audio> partialUpdateAudio(@PathVariable(value = "id", required = false) final Long id, @RequestBody Audio audio)
        throws URISyntaxException {
        log.debug("REST request to partial update Audio partially : {}, {}", id, audio);
        if (audio.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, audio.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!audioRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Audio> result = audioRepository
            .findById(audio.getId())
            .map(existingAudio -> {
                if (audio.getUrl() != null) {
                    existingAudio.setUrl(audio.getUrl());
                }

                return existingAudio;
            })
            .map(audioRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, audio.getId().toString())
        );
    }

    /**
     * {@code GET  /audio} : get all the audio.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list
     *         of audio in body.
     */
    @GetMapping("/audio")
    public List<Audio> getAllAudio() {
        log.debug("REST request to get all Audio");
        return audioRepository.findAll();
    }

    /**
     * {@code GET  /audio/:id} : get the "id" audio.
     *
     * @param id the id of the audio to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
     *         the audio, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/audio/{id}")
    public ResponseEntity<Audio> getAudio(@PathVariable Long id) {
        log.debug("REST request to get Audio : {}", id);
        Optional<Audio> audio = audioRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(audio);
    }

    /**
     * {@code DELETE  /audio/:id} : delete the "id" audio.
     *
     * @param id the id of the audio to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/audio/{id}")
    public ResponseEntity<Void> deleteAudio(@PathVariable Long id) {
        log.debug("REST request to delete Audio : {}", id);
        audioRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
