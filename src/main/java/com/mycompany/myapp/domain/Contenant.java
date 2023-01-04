package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Contenant.
 */
@Entity
@Table(name = "contenant")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Contenant implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "nom", nullable = false)
    private String nom;

    @NotNull
    @Column(name = "is_capital", nullable = false)
    private Boolean isCapital;

    @Lob
    @Column(name = "icone")
    private byte[] icone;

    @Column(name = "icone_content_type")
    private String iconeContentType;

    @Column(name = "absisce")
    private Integer absisce;

    @Column(name = "ordonnee")
    private Integer ordonnee;

    @Lob
    @Column(name = "arriereplan")
    private byte[] arriereplan;

    @Column(name = "arriereplan_content_type")
    private String arriereplanContentType;

    @OneToMany(mappedBy = "contenant")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "villeOrigine", "villeCible", "contenant" }, allowSetters = true)
    private Set<Lien> liens = new HashSet<>();

    @OneToMany(mappedBy = "contenant")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "contenant" }, allowSetters = true)
    private Set<Contenu> contenus = new HashSet<>();

    @OneToMany(mappedBy = "contenant")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "liens", "contenus", "contenants", "lienOrigine", "lienCible", "contenant" }, allowSetters = true)
    private Set<Contenant> contenants = new HashSet<>();

    @JsonIgnoreProperties(value = { "villeOrigine", "villeCible", "contenant" }, allowSetters = true)
    @OneToOne(mappedBy = "villeOrigine")
    private Lien lienOrigine;

    @JsonIgnoreProperties(value = { "villeOrigine", "villeCible", "contenant" }, allowSetters = true)
    @OneToOne(mappedBy = "villeCible")
    private Lien lienCible;

    @ManyToOne
    @JsonIgnoreProperties(value = { "liens", "contenus", "contenants", "lienOrigine", "lienCible", "contenant" }, allowSetters = true)
    private Contenant contenant;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Contenant id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return this.nom;
    }

    public Contenant nom(String nom) {
        this.setNom(nom);
        return this;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public Boolean getIsCapital() {
        return this.isCapital;
    }

    public Contenant isCapital(Boolean isCapital) {
        this.setIsCapital(isCapital);
        return this;
    }

    public void setIsCapital(Boolean isCapital) {
        this.isCapital = isCapital;
    }

    public byte[] getIcone() {
        return this.icone;
    }

    public Contenant icone(byte[] icone) {
        this.setIcone(icone);
        return this;
    }

    public void setIcone(byte[] icone) {
        this.icone = icone;
    }

    public String getIconeContentType() {
        return this.iconeContentType;
    }

    public Contenant iconeContentType(String iconeContentType) {
        this.iconeContentType = iconeContentType;
        return this;
    }

    public void setIconeContentType(String iconeContentType) {
        this.iconeContentType = iconeContentType;
    }

    public Integer getAbsisce() {
        return this.absisce;
    }

    public Contenant absisce(Integer absisce) {
        this.setAbsisce(absisce);
        return this;
    }

    public void setAbsisce(Integer absisce) {
        this.absisce = absisce;
    }

    public Integer getOrdonnee() {
        return this.ordonnee;
    }

    public Contenant ordonnee(Integer ordonnee) {
        this.setOrdonnee(ordonnee);
        return this;
    }

    public void setOrdonnee(Integer ordonnee) {
        this.ordonnee = ordonnee;
    }

    public byte[] getArriereplan() {
        return this.arriereplan;
    }

    public Contenant arriereplan(byte[] arriereplan) {
        this.setArriereplan(arriereplan);
        return this;
    }

    public void setArriereplan(byte[] arriereplan) {
        this.arriereplan = arriereplan;
    }

    public String getArriereplanContentType() {
        return this.arriereplanContentType;
    }

    public Contenant arriereplanContentType(String arriereplanContentType) {
        this.arriereplanContentType = arriereplanContentType;
        return this;
    }

    public void setArriereplanContentType(String arriereplanContentType) {
        this.arriereplanContentType = arriereplanContentType;
    }

    public Set<Lien> getLiens() {
        return this.liens;
    }

    public void setLiens(Set<Lien> liens) {
        if (this.liens != null) {
            this.liens.forEach(i -> i.setContenant(null));
        }
        if (liens != null) {
            liens.forEach(i -> i.setContenant(this));
        }
        this.liens = liens;
    }

    public Contenant liens(Set<Lien> liens) {
        this.setLiens(liens);
        return this;
    }

    public Contenant addLiens(Lien lien) {
        this.liens.add(lien);
        lien.setContenant(this);
        return this;
    }

    public Contenant removeLiens(Lien lien) {
        this.liens.remove(lien);
        lien.setContenant(null);
        return this;
    }

    public Set<Contenu> getContenus() {
        return this.contenus;
    }

    public void setContenus(Set<Contenu> contenus) {
        if (this.contenus != null) {
            this.contenus.forEach(i -> i.setContenant(null));
        }
        if (contenus != null) {
            contenus.forEach(i -> i.setContenant(this));
        }
        this.contenus = contenus;
    }

    public Contenant contenus(Set<Contenu> contenus) {
        this.setContenus(contenus);
        return this;
    }

    public Contenant addContenus(Contenu contenu) {
        this.contenus.add(contenu);
        contenu.setContenant(this);
        return this;
    }

    public Contenant removeContenus(Contenu contenu) {
        this.contenus.remove(contenu);
        contenu.setContenant(null);
        return this;
    }

    public Set<Contenant> getContenants() {
        return this.contenants;
    }

    public void setContenants(Set<Contenant> contenants) {
        if (this.contenants != null) {
            this.contenants.forEach(i -> i.setContenant(null));
        }
        if (contenants != null) {
            contenants.forEach(i -> i.setContenant(this));
        }
        this.contenants = contenants;
    }

    public Contenant contenants(Set<Contenant> contenants) {
        this.setContenants(contenants);
        return this;
    }

    public Contenant addContenants(Contenant contenant) {
        this.contenants.add(contenant);
        contenant.setContenant(this);
        return this;
    }

    public Contenant removeContenants(Contenant contenant) {
        this.contenants.remove(contenant);
        contenant.setContenant(null);
        return this;
    }

    public Lien getLienOrigine() {
        return this.lienOrigine;
    }

    public void setLienOrigine(Lien lien) {
        if (this.lienOrigine != null) {
            this.lienOrigine.setVilleOrigine(null);
        }
        if (lien != null) {
            lien.setVilleOrigine(this);
        }
        this.lienOrigine = lien;
    }

    public Contenant lienOrigine(Lien lien) {
        this.setLienOrigine(lien);
        return this;
    }

    public Lien getLienCible() {
        return this.lienCible;
    }

    public void setLienCible(Lien lien) {
        if (this.lienCible != null) {
            this.lienCible.setVilleCible(null);
        }
        if (lien != null) {
            lien.setVilleCible(this);
        }
        this.lienCible = lien;
    }

    public Contenant lienCible(Lien lien) {
        this.setLienCible(lien);
        return this;
    }

    public Contenant getContenant() {
        return this.contenant;
    }

    public void setContenant(Contenant contenant) {
        this.contenant = contenant;
    }

    public Contenant contenant(Contenant contenant) {
        this.setContenant(contenant);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and
    // setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Contenant)) {
            return false;
        }
        return id != null && id.equals(((Contenant) o).id);
    }

    @Override
    public int hashCode() {
        // see
        // https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
	@Override
	public String toString() {
		return "Contenant{" + "id=" + getId() + ", nom='" + getNom() + "'" + ", isCapital='" + getIsCapital() + "'"
				+ ", icone='" + getIcone() + "'" + ", iconeContentType='" + getIconeContentType() + "'" + ", absisce="
				+ getAbsisce() + ", ordonnee=" + getOrdonnee() + ", arriereplan='" + getArriereplan() + "'"
				+ ", arriereplanContentType='" + getArriereplanContentType() + "'" + "}";
	}
}
