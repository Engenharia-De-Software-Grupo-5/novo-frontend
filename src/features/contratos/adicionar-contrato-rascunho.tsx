"use client"

import { useState } from "react"
import { Button } from "@/features/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/features/components/ui/card"
import { Input } from "@/features/components/ui/input"
import { Textarea } from "@/features/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/features/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/features/components/ui/tabs"
import { Field, FieldLabel, FieldDescription } from "@/features/components/ui/field"
import { Checkbox } from "@/features/components/ui/checkbox"
import { Separator } from "@/features/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/features/components/ui/accordion"
import { PDFViewer } from '@/featuresembedpdf/react-pdf-viewer';
import { RefreshCcw, Menu } from "lucide-react"

// Mock Data
const mockProperties = [
  {
    id: "prop1",
    name: "Apartamento 302 - Ed. Solar do Atlântico",
    basicInfo: {
      identification: "Apto 302",
      status: "Disponível",
      type: "Apartamento",
      area: "85m²",
      bedrooms: "3",
      bathrooms: "2",
      parkingSpots: "1"
    },
    address: {
      street: "Rua das Palmeiras",
      number: "120",
      complement: "Bloco B, Apto 302",
      neighborhood: "Centro",
      city: "Campina Grande",
      state: "PB",
      zipCode: "58220-001"
    }
  },
  {
    id: "prop2",
    name: "Casa 15 - Condomínio Jardim das Flores",
    basicInfo: {
      identification: "Casa 15",
      status: "Ocupado",
      type: "Casa",
      area: "120m²",
      bedrooms: "4",
      bathrooms: "3",
      parkingSpots: "2"
    },
    address: {
      street: "Av. Floriano Peixoto",
      number: "450",
      complement: "Casa 15",
      neighborhood: "Jardins",
      city: "Campina Grande",
      state: "PB",
      zipCode: "58410-410"
    }
  },
  {
    id: "prop3",
    name: "Sala Comercial 801 - Torre Business",
    basicInfo: {
      identification: "Sala 801",
      status: "Disponível",
      type: "Sala Comercial",
      area: "45m²",
      bedrooms: "0",
      bathrooms: "1",
      parkingSpots: "1"
    },
    address: {
      street: "Rua Maciel Pinheiro",
      number: "789",
      complement: "8º andar, Sala 801",
      neighborhood: "Centro",
      city: "Campina Grande",
      state: "PB",
      zipCode: "58400-165"
    }
  }
]

const mockTenants = [
  {
    id: "tenant1",
    name: "João Pedro da Silva",
    personalData: {
      fullName: "João Pedro da Silva",
      birthDate: "15/03/1985",
      rg: "1.234.567",
      rgIssuer: "SSP-PB",
      cpf: "123.456.789-00",
      monthlyIncome: "R$ 8.500,00",
      profession: "Engenheiro Civil",
      maritalStatus: "Casado"
    },
    contact: {
      email: "joao.silva@email.com",
      mainPhone: "(83) 99876-5432",
      secondaryPhone: "(83) 3321-4567",
      address: "Rua Irineu Joffily, 125, Apto 401, Centro, Campina Grande - PB"
    },
    bankData: {
      bank: "Banco do Brasil",
      accountType: "Conta Corrente",
      agency: "1234-5",
      accountNumber: "12345678-9"
    },
    emergencyContacts: [
      {
        name: "Maria Silva",
        relationship: "Esposa",
        phone: "(83) 99123-4567"
      }
    ]
  },
  {
    id: "tenant2",
    name: "Maria Eduarda Santos",
    personalData: {
      fullName: "Maria Eduarda Santos Oliveira",
      birthDate: "22/07/1990",
      rg: "2.345.678",
      rgIssuer: "SSP-PB",
      cpf: "234.567.890-11",
      monthlyIncome: "R$ 12.000,00",
      profession: "Médica Veterinária",
      maritalStatus: "Solteira"
    },
    contact: {
      email: "maria.santos@email.com",
      mainPhone: "(83) 98765-4321",
      secondaryPhone: "(83) 3322-5678",
      address: "Av. Assis Chateaubriand, 890, Apto 202, Liberdade, Campina Grande - PB"
    },
    bankData: {
      bank: "Caixa Econômica Federal",
      accountType: "Conta Poupança",
      agency: "0987",
      accountNumber: "00012345-6"
    },
    emergencyContacts: [
      {
        name: "Carlos Santos",
        relationship: "Pai",
        phone: "(83) 99234-5678"
      }
    ]
  },
  {
    id: "tenant3",
    name: "Carlos Alberto Ferreira",
    personalData: {
      fullName: "Carlos Alberto Ferreira Lima",
      birthDate: "10/11/1978",
      rg: "3.456.789",
      rgIssuer: "SSP-PE",
      cpf: "345.678.901-22",
      monthlyIncome: "R$ 15.000,00",
      profession: "Empresário",
      maritalStatus: "Divorciado"
    },
    contact: {
      email: "carlos.ferreira@empresa.com",
      mainPhone: "(83) 99654-3210",
      secondaryPhone: "(83) 3323-6789",
      address: "Rua Rodrigues Alves, 567, Casa, Prata, Campina Grande - PB"
    },
    bankData: {
      bank: "Itaú",
      accountType: "Conta Corrente",
      agency: "5678",
      accountNumber: "98765-4"
    },
    emergencyContacts: [
      {
        name: "Ana Ferreira",
        relationship: "Filha",
        phone: "(83) 99345-6789"
      }
    ]
  }
]

export default function AdicionarContrato() {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>("")
  const [selectedTenantId, setSelectedTenantId] = useState<string>("")
  const [hasSecondProposer, setHasSecondProposer] = useState(false)
  const [selectedSecondProposerId, setSelectedSecondProposerId] = useState<string>("")

  const selectedProperty = mockProperties.find(p => p.id === selectedPropertyId)
  const selectedTenant = mockTenants.find(t => t.id === selectedTenantId)
  const selectedSecondProposer = mockTenants.find(t => t.id === selectedSecondProposerId)

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Menu className="size-4" />
        <span>Imóveis</span>
        <span>›</span>
        <span>Contratos</span>
        <span>›</span>
        <span className="text-foreground">Adicionar Contrato</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground mb-1">
          Adicionar Contrato
        </h1>
        <p className="text-sm text-muted-foreground">
          Preencha as informações para cadastrar um novo contrato de imóvel.
        </p>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - PDF Preview (Fixed Height) */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <Card className="lg:h-[calc(100vh-12rem)]">
            <CardHeader>
              <CardTitle>Pré-visualização do PDF</CardTitle>
              <CardDescription>
                Visualização prévia do PDF para o contrato a ser adicionado
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col h-[calc(100%-5rem)]">
              <div className="flex-1 min-h-0">
                <PDFViewer
                  config={{ 
                    src: 'https://snippet.embedpdf.com/ebook.pdf',
                    disabledCategories: ['annotation', 'shapes', 'redaction', 'document', 'panel', 'selection','history'],
                    theme: {
                      preference: 'light',
                      light: {
                        background: {
                          app: '#f8fafc',
                          surface: '#f8fafc',
                          surfaceAlt: '#eoeoeo'
                        }
                      }
                    }
                  }}
                  style={{ height: '100%', width: '100%' }}
                  onReady={(registry) => {
                    console.log('PDF viewer ready!', registry);
                  }}
                />
              </div>
              <Button variant="outline" className="mt-4 w-full" size="sm">
                <RefreshCcw className="size-4" />
                Recarregar
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Form (Scrollable) */}
        <div className="space-y-6">
          <Accordion type="multiple" defaultValue={["property", "tenant", "renter", "contract"]} className="space-y-6">
            
            {/* Property Section */}
            <AccordionItem value="property" className="border-none">
              <Card>
                <CardHeader className="pb-3">
                  <AccordionTrigger className="hover:no-underline py-0">
                    <div>
                      <CardTitle className="text-left">Dados do Imóvel</CardTitle>
                      <CardDescription className="text-left">
                        Informações sobre o imóvel
                      </CardDescription>
                    </div>
                  </AccordionTrigger>
                </CardHeader>
                <AccordionContent>
                  <CardContent>
                    <Field>
                      <FieldLabel htmlFor="property">Imóvel *</FieldLabel>
                      <Select value={selectedPropertyId} onValueChange={setSelectedPropertyId}>
                        <SelectTrigger id="property">
                          <SelectValue placeholder="selecionar imóvel" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockProperties.map(property => (
                            <SelectItem key={property.id} value={property.id}>
                              {property.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FieldDescription>
                        É preciso que o imóvel esteja previamente cadastrado.
                      </FieldDescription>
                    </Field>

                    {selectedProperty && (
                      <>
                        <Tabs defaultValue="basicas" className="mt-6">
                          <TabsList className="w-full">
                            <TabsTrigger value="basicas" className="flex-1">
                              Informações Básicas
                            </TabsTrigger>
                            <TabsTrigger value="endereco" className="flex-1">
                              Endereço
                            </TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="basicas" className="mt-6">
                            <div className="rounded-lg border p-6 space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-muted-foreground mb-1">Identificação</p>
                                  <p className="text-sm font-medium">{selectedProperty.basicInfo.identification}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground mb-1">Status</p>
                                  <p className="text-sm font-medium">{selectedProperty.basicInfo.status}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground mb-1">Tipo</p>
                                  <p className="text-sm font-medium">{selectedProperty.basicInfo.type}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground mb-1">Área</p>
                                  <p className="text-sm font-medium">{selectedProperty.basicInfo.area}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground mb-1">Quartos</p>
                                  <p className="text-sm font-medium">{selectedProperty.basicInfo.bedrooms}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground mb-1">Banheiros</p>
                                  <p className="text-sm font-medium">{selectedProperty.basicInfo.bathrooms}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground mb-1">Vagas</p>
                                  <p className="text-sm font-medium">{selectedProperty.basicInfo.parkingSpots}</p>
                                </div>
                              </div>
                            </div>
                          </TabsContent>

                          <TabsContent value="endereco" className="mt-6">
                            <div className="rounded-lg border p-6 space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                  <p className="text-sm text-muted-foreground mb-1">Logradouro</p>
                                  <p className="text-sm font-medium">{selectedProperty.address.street}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground mb-1">Número</p>
                                  <p className="text-sm font-medium">{selectedProperty.address.number}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground mb-1">Bairro</p>
                                  <p className="text-sm font-medium">{selectedProperty.address.neighborhood}</p>
                                </div>
                                <div className="col-span-2">
                                  <p className="text-sm text-muted-foreground mb-1">Complemento</p>
                                  <p className="text-sm font-medium">{selectedProperty.address.complement}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground mb-1">Cidade</p>
                                  <p className="text-sm font-medium">{selectedProperty.address.city}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground mb-1">CEP</p>
                                  <p className="text-sm font-medium">{selectedProperty.address.zipCode}</p>
                                </div>
                              </div>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </>
                    )}
                  </CardContent>
                </AccordionContent>
              </Card>
            </AccordionItem>

            {/* Tenant Section */}
            <AccordionItem value="tenant" className="border-none">
              <Card>
                <CardHeader className="pb-3">
                  <AccordionTrigger className="hover:no-underline py-0">
                    <div>
                      <CardTitle className="text-left">Dados do Locatário</CardTitle>
                      <CardDescription className="text-left">
                        Informações contratuais do locatário
                      </CardDescription>
                    </div>
                  </AccordionTrigger>
                </CardHeader>
                <AccordionContent>
                  <CardContent>
                    <Field>
                      <FieldLabel htmlFor="tenant">Condomínio *</FieldLabel>
                      <Select value={selectedTenantId} onValueChange={setSelectedTenantId}>
                        <SelectTrigger id="tenant">
                          <SelectValue placeholder="selecionar condomínio" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockTenants.map(tenant => (
                            <SelectItem key={tenant.id} value={tenant.id}>
                              {tenant.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FieldDescription>
                        É preciso que o locatário tenha preenchido o formulário de pré-cadastro devidamente.
                      </FieldDescription>
                    </Field>

                    {selectedTenant && (
                      <>
                        <Tabs defaultValue="pessoais" className="mt-6">
                          <TabsList className="w-full grid grid-cols-3">
                            <TabsTrigger value="pessoais">
                              Dados Pessoais
                            </TabsTrigger>
                            <TabsTrigger value="contato">
                              Contato
                            </TabsTrigger>
                            <TabsTrigger value="bancarios">
                              Dados Bancários
                            </TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="pessoais" className="mt-6">
                            <div className="rounded-lg border p-6 space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                  <p className="text-sm text-muted-foreground mb-1">Nome Completo</p>
                                  <p className="text-sm font-medium">{selectedTenant.personalData.fullName}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground mb-1">Data de Nascimento</p>
                                  <p className="text-sm font-medium">{selectedTenant.personalData.birthDate}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground mb-1">Estado Civil</p>
                                  <p className="text-sm font-medium">{selectedTenant.personalData.maritalStatus}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground mb-1">RG</p>
                                  <p className="text-sm font-medium">{selectedTenant.personalData.rg}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground mb-1">Órgão Expedidor</p>
                                  <p className="text-sm font-medium">{selectedTenant.personalData.rgIssuer}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground mb-1">CPF</p>
                                  <p className="text-sm font-medium">{selectedTenant.personalData.cpf}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground mb-1">Renda Mensal</p>
                                  <p className="text-sm font-medium">{selectedTenant.personalData.monthlyIncome}</p>
                                </div>
                                <div className="col-span-2">
                                  <p className="text-sm text-muted-foreground mb-1">Profissão</p>
                                  <p className="text-sm font-medium">{selectedTenant.personalData.profession}</p>
                                </div>
                              </div>
                            </div>
                          </TabsContent>

                          <TabsContent value="contato" className="mt-6">
                            <div className="rounded-lg border p-6 space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                  <p className="text-sm text-muted-foreground mb-1">Email</p>
                                  <p className="text-sm font-medium">{selectedTenant.contact.email}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground mb-1">Telefone Principal</p>
                                  <p className="text-sm font-medium">{selectedTenant.contact.mainPhone}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground mb-1">Telefone Secundário</p>
                                  <p className="text-sm font-medium">{selectedTenant.contact.secondaryPhone}</p>
                                </div>
                                <div className="col-span-2">
                                  <p className="text-sm text-muted-foreground mb-1">Endereço</p>
                                  <p className="text-sm font-medium">{selectedTenant.contact.address}</p>
                                </div>
                                
                                {selectedTenant.emergencyContacts.length > 0 && (
                                  <>
                                    <div className="col-span-2 mt-2">
                                      <Separator />
                                    </div>
                                    <div className="col-span-2">
                                      <p className="text-sm font-semibold mb-3">Contatos de Emergência</p>
                                    </div>
                                    {selectedTenant.emergencyContacts.map((contact, index) => (
                                      <div key={index} className="col-span-2 grid grid-cols-3 gap-4">
                                        <div>
                                          <p className="text-sm text-muted-foreground mb-1">Nome</p>
                                          <p className="text-sm font-medium">{contact.name}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-muted-foreground mb-1">Parentesco</p>
                                          <p className="text-sm font-medium">{contact.relationship}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-muted-foreground mb-1">Telefone</p>
                                          <p className="text-sm font-medium">{contact.phone}</p>
                                        </div>
                                      </div>
                                    ))}
                                  </>
                                )}
                              </div>
                            </div>
                          </TabsContent>

                          <TabsContent value="bancarios" className="mt-6">
                            <div className="rounded-lg border p-6 space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                  <p className="text-sm text-muted-foreground mb-1">Banco</p>
                                  <p className="text-sm font-medium">{selectedTenant.bankData.bank}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground mb-1">Tipo de Conta</p>
                                  <p className="text-sm font-medium">{selectedTenant.bankData.accountType}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground mb-1">Agência</p>
                                  <p className="text-sm font-medium">{selectedTenant.bankData.agency}</p>
                                </div>
                                <div className="col-span-2">
                                  <p className="text-sm text-muted-foreground mb-1">Número da Conta</p>
                                  <p className="text-sm font-medium">{selectedTenant.bankData.accountNumber}</p>
                                </div>
                              </div>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </>
                    )}
                  </CardContent>
                </AccordionContent>
              </Card>
            </AccordionItem>

            {/* Renter Section */}
            <AccordionItem value="renter" className="border-none">
              <Card>
                <CardHeader className="pb-3">
                  <AccordionTrigger className="hover:no-underline py-0">
                    <div>
                      <CardTitle className="text-left">Dados do Locador</CardTitle>
                      <CardDescription className="text-left">
                        Informações do locador
                      </CardDescription>
                    </div>
                  </AccordionTrigger>
                </CardHeader>
                <AccordionContent>
                  <CardContent className="space-y-4">
                    <Field>
                      <FieldLabel htmlFor="renter-name">Nome Completo *</FieldLabel>
                      <Input 
                        id="renter-name" 
                        placeholder="Evíl Rabbit"
                      />
                    </Field>

                    <div className="grid grid-cols-2 gap-4">
                      <Field>
                        <FieldLabel htmlFor="renter-cpf">CPF *</FieldLabel>
                        <Input 
                          id="renter-cpf" 
                          placeholder="XXX.XXX.XXX-XX"
                        />
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="renter-phone">Telefone Principal *</FieldLabel>
                        <Input 
                          id="renter-phone" 
                          placeholder="(xx) xxxxx-xxxx"
                        />
                      </Field>
                    </div>

                    <Field>
                      <FieldLabel htmlFor="renter-email">Email *</FieldLabel>
                      <Input 
                        id="renter-email" 
                        type="email"
                        placeholder="m@example.com"
                      />
                    </Field>
                  </CardContent>
                </AccordionContent>
              </Card>
            </AccordionItem>

            {/* Contract Data Section */}
            <AccordionItem value="contract" className="border-none">
              <Card>
                <CardHeader className="pb-3">
                  <AccordionTrigger className="hover:no-underline py-0">
                    <div>
                      <CardTitle className="text-left">Dados Contratuais</CardTitle>
                      <CardDescription className="text-left">
                        Informações financeiras e contratuais
                      </CardDescription>
                    </div>
                  </AccordionTrigger>
                </CardHeader>
                <AccordionContent>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Field>
                        <FieldLabel htmlFor="rent-value">Valor do Aluguel *</FieldLabel>
                        <Input 
                          id="rent-value" 
                          placeholder="R$ 0,00"
                          type="text"
                        />
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="condo-fee">Taxa de Condomínio</FieldLabel>
                        <Input 
                          id="condo-fee" 
                          placeholder="R$ 0,00"
                          type="text"
                        />
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="iptu-value">Valor IPTU</FieldLabel>
                        <Input 
                          id="iptu-value" 
                          placeholder="R$ 0,00"
                          type="text"
                        />
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="tcr-value">Valor TCR</FieldLabel>
                        <Input 
                          id="tcr-value" 
                          placeholder="R$ 0,00"
                          type="text"
                        />
                      </Field>
                    </div>

                    <Field>
                      <FieldLabel htmlFor="additional-info">Informações Adicionais</FieldLabel>
                      <Textarea
                        id="additional-info"
                        placeholder="Digite informações adicionais sobre o contrato..."
                        className="min-h-32"
                      />
                      <FieldDescription>
                        Inclua quaisquer observações ou cláusulas especiais do contrato.
                      </FieldDescription>
                    </Field>
                  </CardContent>
                </AccordionContent>
              </Card>
            </AccordionItem>

            {/* Second Proposer Section */}
            <AccordionItem value="second-proposer" className="border-none">
              <Card>
                <CardHeader className="pb-3">
                  <AccordionTrigger className="hover:no-underline py-0">
                    <div>
                      <CardTitle className="text-left">Segundo Proponente</CardTitle>
                      <CardDescription className="text-left">
                        Informações caso o contrato precise de outro proponente
                      </CardDescription>
                    </div>
                  </AccordionTrigger>
                </CardHeader>
                <AccordionContent>
                  <CardContent>
                    <Field orientation="horizontal">
                      <FieldLabel htmlFor="second-proposer" className="flex items-center gap-2 cursor-pointer">
                        <Checkbox 
                          id="second-proposer"
                          checked={hasSecondProposer}
                          onCheckedChange={(checked) => {
                            setHasSecondProposer(checked as boolean)
                            if (!checked) {
                              setSelectedSecondProposerId("")
                            }
                          }}
                        />
                        <span>Contrato necessita de 2º proponente</span>
                      </FieldLabel>
                    </Field>

                    {hasSecondProposer && (
                      <div className="mt-6 space-y-4">
                        <Field>
                          <FieldLabel htmlFor="second-proposer-select">Selecionar Condomínio *</FieldLabel>
                          <Select value={selectedSecondProposerId} onValueChange={setSelectedSecondProposerId}>
                            <SelectTrigger id="second-proposer-select">
                              <SelectValue placeholder="selecionar condomínio" />
                            </SelectTrigger>
                            <SelectContent>
                              {mockTenants
                                .filter(t => t.id !== selectedTenantId)
                                .map(tenant => (
                                  <SelectItem key={tenant.id} value={tenant.id}>
                                    {tenant.name}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                          <FieldDescription>
                            É preciso que o segundo proponente tenha preenchido o formulário de pré-cadastro devidamente.
                          </FieldDescription>
                        </Field>

                        {selectedSecondProposer && (
                          <Tabs defaultValue="pessoais" className="mt-6">
                            <TabsList className="w-full grid grid-cols-3">
                              <TabsTrigger value="pessoais">
                                Dados Pessoais
                              </TabsTrigger>
                              <TabsTrigger value="contato">
                                Contato
                              </TabsTrigger>
                              <TabsTrigger value="bancarios">
                                Dados Bancários
                              </TabsTrigger>
                            </TabsList>
                            
                            <TabsContent value="pessoais" className="mt-6">
                              <div className="rounded-lg border p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="col-span-2">
                                    <p className="text-sm text-muted-foreground mb-1">Nome Completo</p>
                                    <p className="text-sm font-medium">{selectedSecondProposer.personalData.fullName}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-1">Data de Nascimento</p>
                                    <p className="text-sm font-medium">{selectedSecondProposer.personalData.birthDate}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-1">Estado Civil</p>
                                    <p className="text-sm font-medium">{selectedSecondProposer.personalData.maritalStatus}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-1">RG</p>
                                    <p className="text-sm font-medium">{selectedSecondProposer.personalData.rg}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-1">Órgão Expedidor</p>
                                    <p className="text-sm font-medium">{selectedSecondProposer.personalData.rgIssuer}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-1">CPF</p>
                                    <p className="text-sm font-medium">{selectedSecondProposer.personalData.cpf}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-1">Renda Mensal</p>
                                    <p className="text-sm font-medium">{selectedSecondProposer.personalData.monthlyIncome}</p>
                                  </div>
                                  <div className="col-span-2">
                                    <p className="text-sm text-muted-foreground mb-1">Profissão</p>
                                    <p className="text-sm font-medium">{selectedSecondProposer.personalData.profession}</p>
                                  </div>
                                </div>
                              </div>
                            </TabsContent>

                            <TabsContent value="contato" className="mt-6">
                              <div className="rounded-lg border p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="col-span-2">
                                    <p className="text-sm text-muted-foreground mb-1">Email</p>
                                    <p className="text-sm font-medium">{selectedSecondProposer.contact.email}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-1">Telefone Principal</p>
                                    <p className="text-sm font-medium">{selectedSecondProposer.contact.mainPhone}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-1">Telefone Secundário</p>
                                    <p className="text-sm font-medium">{selectedSecondProposer.contact.secondaryPhone}</p>
                                  </div>
                                  <div className="col-span-2">
                                    <p className="text-sm text-muted-foreground mb-1">Endereço</p>
                                    <p className="text-sm font-medium">{selectedSecondProposer.contact.address}</p>
                                  </div>
                                  
                                  {selectedSecondProposer.emergencyContacts.length > 0 && (
                                    <>
                                      <div className="col-span-2 mt-2">
                                        <Separator />
                                      </div>
                                      <div className="col-span-2">
                                        <p className="text-sm font-semibold mb-3">Contatos de Emergência</p>
                                      </div>
                                      {selectedSecondProposer.emergencyContacts.map((contact, index) => (
                                        <div key={index} className="col-span-2 grid grid-cols-3 gap-4">
                                          <div>
                                            <p className="text-sm text-muted-foreground mb-1">Nome</p>
                                            <p className="text-sm font-medium">{contact.name}</p>
                                          </div>
                                          <div>
                                            <p className="text-sm text-muted-foreground mb-1">Parentesco</p>
                                            <p className="text-sm font-medium">{contact.relationship}</p>
                                          </div>
                                          <div>
                                            <p className="text-sm text-muted-foreground mb-1">Telefone</p>
                                            <p className="text-sm font-medium">{contact.phone}</p>
                                          </div>
                                        </div>
                                      ))}
                                    </>
                                  )}
                                </div>
                              </div>
                            </TabsContent>

                            <TabsContent value="bancarios" className="mt-6">
                              <div className="rounded-lg border p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="col-span-2">
                                    <p className="text-sm text-muted-foreground mb-1">Banco</p>
                                    <p className="text-sm font-medium">{selectedSecondProposer.bankData.bank}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-1">Tipo de Conta</p>
                                    <p className="text-sm font-medium">{selectedSecondProposer.bankData.accountType}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-1">Agência</p>
                                    <p className="text-sm font-medium">{selectedSecondProposer.bankData.agency}</p>
                                  </div>
                                  <div className="col-span-2">
                                    <p className="text-sm text-muted-foreground mb-1">Número da Conta</p>
                                    <p className="text-sm font-medium">{selectedSecondProposer.bankData.accountNumber}</p>
                                  </div>
                                </div>
                              </div>
                            </TabsContent>
                          </Tabs>
                        )}
                      </div>
                    )}
                  </CardContent>
                </AccordionContent>
              </Card>
            </AccordionItem>

          </Accordion>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pb-6">
            <Button variant="outline" size="lg">
              Cancelar
            </Button>
            <Button size="lg">
              Criar Contrato
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}