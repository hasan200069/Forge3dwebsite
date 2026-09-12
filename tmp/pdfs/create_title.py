from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from pypdf import PdfReader
out='output/pdf/Hasan_Kamal_Syed_26I-7842_Research_Title_Selection.pdf'
styles=getSampleStyleSheet()
styles.add(ParagraphStyle(name='BodyTextCustom',fontName='Times-Roman',fontSize=11,leading=14,spaceAfter=6))
styles.add(ParagraphStyle(name='SectionCustom',fontName='Times-Bold',fontSize=11,leading=14,spaceBefore=7,spaceAfter=3))
styles.add(ParagraphStyle(name='MainCustom',fontName='Times-Bold',fontSize=16,leading=19,alignment=TA_CENTER,spaceAfter=5))
styles.add(ParagraphStyle(name='SubCustom',fontName='Times-Roman',fontSize=12,leading=15,alignment=TA_CENTER,spaceAfter=15))
styles.add(ParagraphStyle(name='TitleCustom',fontName='Times-Bold',fontSize=13,leading=16,spaceAfter=7))
styles.add(ParagraphStyle(name='RefCustom',fontName='Times-Roman',fontSize=9.5,leading=12,spaceAfter=4))
story=[]
def p(t,s='BodyTextCustom'): story.append(Paragraph(t,styles[s]))
def section(h,t): p(h,'SectionCustom');p(t)
p('Research Methodologies','MainCustom')
p('Task 1: Research Title Selection','SubCustom')
t=Table([[Paragraph('<b>Student Name:</b> Hasan Kamal Syed',styles['BodyTextCustom']),Paragraph('<b>Student ID:</b> 26I-7842',styles['BodyTextCustom'])],[Paragraph('<b>Instructor:</b> Akhtar Jamil',styles['BodyTextCustom']),Paragraph('<b>Date:</b> September 11, 2026',styles['BodyTextCustom'])]],colWidths=[282,205])
t.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),0),('RIGHTPADDING',(0,0),(-1,-1),0),('BOTTOMPADDING',(0,0),(-1,-1),3),('LINEBELOW',(0,-1),(-1,-1),0.5,colors.HexColor('#777777'))]))
story.append(t)
p('Proposed Research Title','SectionCustom')
p('Version-Aware Memory Synchronization for Consistent Retrieval-Augmented Generation in Distributed Systems','TitleCustom')
section('Research Area','Distributed Systems, Artificial Intelligence, and External Memory Management.')
section('Problem Statement','Retrieval-Augmented Generation (RAG) systems use an external knowledge store to provide context to a language model. When information changes, distributed retrieval indexes may temporarily contain different versions of the same document. Consequently, an AI system may retrieve outdated or deleted information. Recent research identifies data staleness and synchronization problems in split RAG data architectures [1]. This study will investigate whether version-aware synchronization can reduce these inconsistencies while maintaining acceptable retrieval performance.')
section('Research Question','To what extent can version-aware synchronization reduce stale retrievals in a distributed RAG system compared with periodic synchronization?')
p('Research Objectives','SectionCustom')
p('1. Develop a prototype that tracks document versions across distributed retrieval replicas.<br/>2. Implement a synchronization mechanism for document updates and deletions.<br/>3. Compare stale retrieval rate, synchronization delay, and query latency against a periodic synchronization baseline.')
section('Proposed Methodology','Three local retrieval services will simulate distributed nodes. A small document collection will be subjected to controlled updates, deletions, and network delays. The proposed mechanism will attach version identifiers to updates and retain deletion records to prevent older content from reappearing. Both approaches will be evaluated under identical workloads. Retrieval consistency will be assessed directly, with a limited number of language-model calls used to examine the effect on generated answers.')
section('Feasibility and Expected Contribution','The prototype can run on a laptop using lightweight services and a small embedding model, without training a language model or requiring a GPU cluster. The expected contribution is a prototype and empirical evaluation of the trade-off between retrieval freshness and synchronization overhead. The specific novelty will be refined through further literature review.')
p('Initial Reference','SectionCustom')
p('[1] Budigi, V. K. P., &amp; Sirigiri, S. C. (2026). <i>Beyond Similarity Search: A Unified Data Layer for Production RAG Systems.</i> arXiv preprint, arXiv:2605.03275.<br/><link href="https://arxiv.org/abs/2605.03275" color="#174b75">https://arxiv.org/abs/2605.03275</link>','RefCustom')
def footer(c,d):
 c.setFont('Times-Roman',9);c.setFillColor(colors.HexColor('#555555'));c.drawString(54,30,'Hasan Kamal Syed | 26I-7842');c.drawRightString(A4[0]-54,30,str(d.page))
SimpleDocTemplate(out,pagesize=A4,rightMargin=54,leftMargin=54,topMargin=39,bottomMargin=44,title='Research Title Selection - Hasan Kamal Syed',author='Hasan Kamal Syed').build(story,onFirstPage=footer,onLaterPages=footer)
r=PdfReader(out)
print('Pages:',len(r.pages))
print('Text characters:',sum(len(x.extract_text()) for x in r.pages))
