package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Contenant;
import com.mycompany.myapp.domain.Contenu;
import com.mycompany.myapp.domain.Fichiay;
import com.mycompany.myapp.domain.Lien;
import com.mycompany.myapp.repository.ContenantRepository;
import com.mycompany.myapp.repository.ContenuRepository;
import com.mycompany.myapp.repository.LienRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Contenant}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ContenantResource {

    private final Logger log = LoggerFactory.getLogger(ContenantResource.class);

    private static final String ENTITY_NAME = "contenant";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ContenuRepository contenuRepository;

    private final LienRepository lienripository;

    private final ContenantRepository contenantRepository;

    public ContenantResource(ContenantRepository contenantRepository, ContenuRepository contenuRepository, LienRepository lienripository) {
        this.contenantRepository = contenantRepository;
        this.contenuRepository = contenuRepository;
        this.lienripository = lienripository;
    }

    /**
     * {@code POST  /contenants} : Create a new contenant.
     *
     * @param contenant the contenant to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new contenant, or with status {@code 400 (Bad Request)} if the contenant has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/contenants")
    public ResponseEntity<Contenant> createContenant(@Valid @RequestBody Contenant contenant) throws URISyntaxException {
        log.debug("REST request HEHEHEHE", contenant.getIsAvant());
        log.debug("REST request HEHEHEHE", contenant.getDescription());
        if (contenant.getId() != null) {
            throw new BadRequestAlertException("A new contenant cannot already have an ID", ENTITY_NAME, "idexists");
        }
        contenant.setVues(0);
        Contenant result = contenantRepository.save(contenant);
        return ResponseEntity
            .created(new URI("/api/contenants/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /contenants/:id} : Updates an existing contenant.
     *
     * @param id the id of the contenant to save.
     * @param contenant the contenant to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated contenant,
     * or with status {@code 400 (Bad Request)} if the contenant is not valid,
     * or with status {@code 500 (Internal Server Error)} if the contenant couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/contenants/{id}")
    public ResponseEntity<Contenant> updateContenant(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Contenant contenant
    ) throws URISyntaxException {
        log.debug("REST request to update Contenant : {}, {}", id, contenant);
        if (contenant.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, contenant.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!contenantRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Contenant result = contenantRepository.save(contenant);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, contenant.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /contenants/:id} : Partial updates given fields of an existing contenant, field will ignore if it is null
     *
     * @param id the id of the contenant to save.
     * @param contenant the contenant to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated contenant,
     * or with status {@code 400 (Bad Request)} if the contenant is not valid,
     * or with status {@code 404 (Not Found)} if the contenant is not found,
     * or with status {@code 500 (Internal Server Error)} if the contenant couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/contenants/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Contenant> partialUpdateContenant(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Contenant contenant
    ) throws URISyntaxException {
        log.debug("REST request to partial update Contenant partially : {}, {}", id, contenant);
        if (contenant.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, contenant.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!contenantRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Contenant> result = contenantRepository
            .findById(contenant.getId())
            .map(existingContenant -> {
                if (contenant.getNom() != null) {
                    existingContenant.setNom(contenant.getNom());
                }
                if (contenant.getIsCapital() != null) {
                    existingContenant.setIsCapital(contenant.getIsCapital());
                }
                if (contenant.getIcone() != null) {
                    existingContenant.setIcone(contenant.getIcone());
                }
                if (contenant.getIconeContentType() != null) {
                    existingContenant.setIconeContentType(contenant.getIconeContentType());
                }
                if (contenant.getAbsisce() != null) {
                    existingContenant.setAbsisce(contenant.getAbsisce());
                }
                if (contenant.getOrdonnee() != null) {
                    existingContenant.setOrdonnee(contenant.getOrdonnee());
                }
                if (contenant.getArriereplan() != null) {
                    existingContenant.setArriereplan(contenant.getArriereplan());
                }
                if (contenant.getArriereplanContentType() != null) {
                    existingContenant.setArriereplanContentType(contenant.getArriereplanContentType());
                }

                return existingContenant;
            })
            .map(contenantRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, contenant.getId().toString())
        );
    }

    @PutMapping("/contenants/{id}/vues")
    public ResponseEntity<Contenant> addVue(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Contenant contenant
    ) throws URISyntaxException {
        log.debug("Ajout d'une bonne vue : {}, {}", id, contenant);
        if (contenant.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, contenant.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!contenantRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        if (contenant.getVues() != null) {
            contenant.setVues(contenant.getVues() + 1);
        }

        Contenant result = contenantRepository.save(contenant);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, contenant.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /contenants} : get all the contenants.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of contenants in body.
     */
    @GetMapping("/contenants")
    public List<Contenant> getAllContenants(@RequestParam(required = false) String contnantnull) {
        log.info("c " + contnantnull);
        if ("lienorigine-is-null".equals(contnantnull)) {
            log.debug("REST request to get all Contenants where lienOrigine is null");
            return StreamSupport
                .stream(contenantRepository.findAll().spliterator(), false)
                .filter(contenant -> contenant.getLienOrigine() == null)
                .collect(Collectors.toList());
        }

        if ("liencible-is-null".equals(contnantnull)) {
            log.debug("REST request to get all Contenants where lienCible is null");
            return StreamSupport
                .stream(contenantRepository.findAll().spliterator(), false)
                .filter(contenant -> contenant.getLienCible() == null)
                .collect(Collectors.toList());
        }
        if ("contenant-is-null".equals(contnantnull)) {
            log.info("mino");
            log.debug("REST request to get all Contenants where lienOrigine is null");
            List<Contenant> result = StreamSupport
                .stream(contenantRepository.findAll().spliterator(), false)
                .filter(contenant -> contenant.getContenant() == null)
                .collect(Collectors.toList());
            List<Contenant> rere = new ArrayList<>();
            Random rand = new Random();
            rere.add(result.get((int) (Math.random() * (result.size()))));
            rere.add(result.get((int) (Math.random() * (result.size()))));
            rere.add(result.get((int) (Math.random() * (result.size()))));
            return rere;
        }

        log.debug("REST request to get all Contenants");
        return contenantRepository.findAll();
    }

    /**
     * {@code GET  /contenants/:id} : get the "id" contenant.
     *
     * @param id the id of the contenant to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the contenant, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/contenantsnouveauxcontenus/{id}")
    public List<Contenu> getNouveauxContenus(@PathVariable Long id) {
        log.debug("REST request to get Contenant : {}", id);
        Optional<Contenant> contenant = contenantRepository.findById(id);

        List<Contenu> cn = new ArrayList<>();

        cn = contenuRepository.findAll();

        List<Contenu> cf = new ArrayList<>();
        // RAJOUT YAYA
        for (Contenu cu : cn) {
            if (cu.getContenant() != null && cu.getContenant().getId() == id) {
                cf.add(cu);
            }
        }

        Collections.sort(cf, Comparator.comparing(Contenu::getDate_creation).reversed());
        //        List<Contenu> latestContents = cn.subList(0, Math.min(cn.size(), 10));

        return cf;
    }

    /**
     * {@code GET  /contenants/:id} : get the "id" contenant.
     *
     * @param id the id of the contenant to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the contenant, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/contenants/{id}")
    public ResponseEntity<Contenant> getContenant(@PathVariable Long id) {
        log.debug("REST request to get Contenant : {}", id);
        Optional<Contenant> contenant = contenantRepository.findById(id);

        List<Contenu> cn = new ArrayList<>();
        List<Lien> cl = new ArrayList<>();
        List<Contenant> cna = new ArrayList<>();

        cn = contenuRepository.findAll();
        Collections.sort(cn, Comparator.comparing(Contenu::getDate_creation).reversed());

        cn = cn.subList(0, 10);
        cl = lienripository.findAll();
        cna = contenantRepository.findAll();
        // RAJOUT YAYA
        for (Contenu cu : cn) {
            if (cu.getContenant() != null && cu.getContenant().getId() == id) {
                contenant.get().addContenus(cu);
            }
        }

        // RAJOUT YAYA
        for (Lien cu : cl) {
            if (cu.getContenant() != null && cu.getContenant().getId() == id && cu.getVilleOrigine().getId() == id) {
                contenant.get().addLiens(cu);
            }
        }

        for (Contenant ca : cna) {
            if (ca.getContenant() != null && ca.getContenant().getId() == id) {
                contenant.get().addContenants(ca);
            }
        }

        return ResponseUtil.wrapOrNotFound(contenant);
    }

    /**
     * {@code DELETE  /contenants/:id} : delete the "id" contenant.
     *
     * @param id the id of the contenant to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/contenants/{id}")
    public ResponseEntity<Void> deleteContenant(@PathVariable Long id) {
        log.debug("REST request to delete Contenant : {}", id);
        contenantRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    @PostMapping("/contenantfileicone/{id}")
    public ResponseEntity<Fichiay> createAudioFileIcone(
        @RequestBody Fichiay fichou,
        @PathVariable(value = "id", required = false) final Long id
    ) throws URISyntaxException, IOException {
        log.debug("YPASSAT ICONE  + " + fichou.getNom());
        // try (FileOutputStream fos = new FileOutputStream("C:\\temp\\audio\\nanmiou" +
        // lastAudioId + ".txt")) {
        try (FileOutputStream fos = new FileOutputStream("C:\\resources\\content\\contenants\\icone\\ico" + id + "." + fichou.getExt())) {
            fos.write(fichou.getFichier());
            // fos.close(); There is no more need for this line since you had created the
            // instance of "fos" inside the try. And this will automatically close the
            // OutputStream
        }

        return ResponseEntity
            .created(new URI("/api/contenantfileicone"))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, "hoo"))
            .body(fichou);
    }

    @PostMapping("/contenantfilearriereplan/{id}")
    public ResponseEntity<Fichiay> createAudioFileAP(
        @RequestBody Fichiay fichou,
        @PathVariable(value = "id", required = false) final Long id
    ) throws URISyntaxException, IOException {
        // try (FileOutputStream fos = new FileOutputStream("C:\\temp\\audio\\nanmiou" +
        // lastAudioId + ".txt")) {
        try (
            FileOutputStream fos = new FileOutputStream("C:\\resources\\content\\contenants\\arriereplans\\ap" + id + "." + fichou.getExt())
        ) {
            fos.write(fichou.getFichier());
            // fos.close(); There is no more need for this line since you had created the
            // instance of "fos" inside the try. And this will automatically close the
            // OutputStream
        }

        return ResponseEntity
            .created(new URI("/api/contenantfilearriereplan"))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, "hoo"))
            .body(fichou);
    }
}
